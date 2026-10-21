import { ChevronDown } from "lucide-react";
import { lazy, Suspense, useId, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VideoModal, manualVideoUrl } from "../components/VideoModal";

const ManualModal = lazy(() => import("../components/ManualModal").then((mod) => ({ default: mod.ManualModal })));
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { CmsManual } from "../types/cms";
import { getVisibleManuals } from "../utils/manualsVisibility";
import { pickBilingual, type Lang } from "../utils/siteCopy";

function copy(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

type Fields = { fullName: string; email: string; message: string; companyFax: string };
const EMPTY: Fields = { fullName: "", email: "", message: "", companyFax: "" };
type Status = "idle" | "submitting" | "sent" | "draft" | "error";

export function Support() {
  const { t, i18n } = useTranslation();
  const { defaultProduct } = useCms();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const page = config?.supportPage;
  const email = config?.contact?.email?.trim() || "support@coolinkey.com";
  const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT?.trim() || "";
  const text = (field: Parameters<typeof pickBilingual>[1], key: string) => pickBilingual(lang, field, t(key));
  const [active, setActive] = useState<CmsManual | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const formId = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const manuals = useMemo(
    () => getVisibleManuals(defaultProduct?.manuals ?? [], config?.manualsSection?.hiddenManualTypes),
    [defaultProduct, config],
  );
  const docs = manuals.filter((item) => item.type !== "video");
  const videos = manuals.filter((item) => item.type === "video");
  const productName = defaultProduct ? (lang === "zh" ? defaultProduct.name.zh : defaultProduct.name.en) : "CLX1";

  const steps = (page?.steps ?? []).map((step) => ({
    id: step.id,
    title: pickBilingual(lang, step.title, ""),
    hint: pickBilingual(lang, step.hint, ""),
  }));
  const faqs = (page?.faqs ?? []).map((item) => ({
    id: item.id,
    q: pickBilingual(lang, item.question, ""),
    a: pickBilingual(lang, item.answer, ""),
  }));

  const set = (key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "error" || status === "draft") setStatus("idle");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.fullName.trim()) next.fullName = copy(lang, "Please enter your name.", "请填写姓名。");
    if (!fields.email.trim()) next.email = copy(lang, "Please enter an email address.", "请填写电子邮箱。");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      next.email = copy(lang, "Please enter a valid email address.", "请填写有效的邮箱地址。");
    }
    if (!fields.message.trim()) next.message = copy(lang, "Please enter a message.", "请填写信息。");
    setErrors(next);
    const first = (Object.keys(next) as (keyof Fields)[])[0];
    if (first) {
      document.getElementById(`${formId}-${first}`)?.focus();
      return;
    }
    if (fields.companyFax.trim()) {
      setStatus("error");
      return;
    }

    const payload = {
      fullName: fields.fullName.trim(),
      email: fields.email.trim(),
      message: fields.message.trim(),
      source: "coolinkey_website",
      sourcePage: "/#support",
      lang,
      topic: "support",
    };

    setStatus("submitting");
    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("http");
        setStatus("sent");
      } catch {
        setStatus("error");
      }
      return;
    }

    const subject = "COOLINKEY support message";
    const body = [`Name: ${payload.fullName}`, `Email: ${payload.email}`, "", payload.message].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("draft");
  };

  return (
    <div className="support-stack page-wrap">
      <section className="support-split">
        <div className="support-copy">
          <p className="support-kicker">{text(page?.kicker, "supportPage.kicker")}</p>
          <h2>{text(page?.title, "supportPage.title")}</h2>
          <p>{text(page?.subtitle, "supportPage.subtitle")}</p>
        </div>
        <div className="support-panel">
          {steps.length ? (
            <details>
              <summary>
                {productName}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <ol>
                {steps.map((step, index) => (
                  <li key={step.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.hint}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
          {docs.map((manual) => (
            <details key={manual.id}>
              <summary>
                {lang === "zh" ? manual.title.zh : manual.title.en}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <button type="button" onClick={() => setActive(manual)}>
                {t("manualsSection.preview")}
              </button>
            </details>
          ))}
          {videos.map((manual) => (
            <details key={manual.id}>
              <summary>
                {lang === "zh" ? manual.title.zh : manual.title.en}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <button type="button" onClick={() => setVideoSrc(manualVideoUrl(manual, lang))}>
                {copy(lang, "Play", "播放")}
              </button>
            </details>
          ))}
        </div>
      </section>

      <section className="support-split">
        <div className="support-copy">
          <p className="support-kicker">{text(page?.kicker, "supportPage.kicker")}</p>
          <h2>{text(page?.troubleshooting, "supportPage.troubleshooting")}</h2>
          <p>{text(page?.troubleshootingHint, "supportPage.troubleshootingHint")}</p>
        </div>
        <div className="support-panel">
          {faqs.map((item) => (
            <details key={item.id}>
              <summary>
                {item.q}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="support-ask" aria-labelledby="support-ask-title">
        <div className="support-copy">
          <p className="support-kicker">{text(page?.kicker, "supportPage.kicker")}</p>
          <h2 id="support-ask-title">{text(page?.helpTitle, "supportPage.helpTitle")}</h2>
          <p>{text(page?.helpBody, "supportPage.helpBody")}</p>
          <p>
            {copy(lang, "For anything about CLX1, email ", "对 CLX1 有任何疑问，请发送邮件至 ")}
            <a href={`mailto:${email}`}>{email}</a>
            {copy(lang, ".", "。")}
          </p>
        </div>
        {status === "sent" ? (
          <div className="support-form-card">
            <p role="status">{copy(lang, "Your message has been submitted.", "你的留言已提交。")}</p>
          </div>
        ) : (
          <form className="support-form-card" onSubmit={onSubmit} noValidate>
            <div className="support-fields">
              <label htmlFor={`${formId}-fullName`}>
                <span className="sr-only">{copy(lang, "Name", "姓名")}</span>
                <input
                  id={`${formId}-fullName`}
                  name="fullName"
                  autoComplete="name"
                  placeholder={copy(lang, "Name", "姓名")}
                  value={fields.fullName}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? `${formId}-fullName-error` : undefined}
                  onChange={(event) => set("fullName", event.target.value)}
                />
                {errors.fullName ? <span id={`${formId}-fullName-error`}>{errors.fullName}</span> : null}
              </label>
              <label htmlFor={`${formId}-email`}>
                <span className="sr-only">{copy(lang, "Email", "电子邮箱")}</span>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={copy(lang, "Email", "电子邮箱")}
                  value={fields.email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                  onChange={(event) => set("email", event.target.value)}
                />
                {errors.email ? <span id={`${formId}-email-error`}>{errors.email}</span> : null}
              </label>
              <label className="support-message" htmlFor={`${formId}-message`}>
                <span className="sr-only">{copy(lang, "Message", "信息")}</span>
                <textarea
                  id={`${formId}-message`}
                  name="message"
                  placeholder={copy(lang, "Message", "信息")}
                  value={fields.message}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? `${formId}-message-error` : undefined}
                  onChange={(event) => set("message", event.target.value)}
                />
                {errors.message ? <span id={`${formId}-message-error`}>{errors.message}</span> : null}
              </label>
            </div>
            <div className="hp" aria-hidden="true">
              <label htmlFor={`${formId}-companyFax`}>Fax</label>
              <input
                id={`${formId}-companyFax`}
                name="companyFax"
                tabIndex={-1}
                autoComplete="off"
                value={fields.companyFax}
                onChange={(event) => set("companyFax", event.target.value)}
              />
            </div>
            <button className="v2-btn v2-btn-primary" type="submit" disabled={status === "submitting"}>
              {copy(lang, "Send message", "发送消息")}
            </button>
            {endpoint ? null : (
              <p className="support-note">
                {copy(
                  lang,
                  `Submitting opens an email to ${email}. This page cannot confirm delivery.`,
                  `提交后会打开写给 ${email} 的邮件。此页面无法确认是否已发出。`,
                )}
              </p>
            )}
            {status === "draft" ? (
              <p className="support-note" role="status">
                {copy(lang, "Your email app should now have this message ready. Send it to complete the request.", "邮件应用中应已准备好这封留言。发送后即完成。")}
              </p>
            ) : null}
            {status === "error" ? (
              <p className="support-error" role="alert">
                {copy(lang, "The message could not be submitted. Please try again.", "留言未能提交，请再试一次。")}
              </p>
            ) : null}
            <p className="support-note">
              <Link to="/privacy">{copy(lang, "Privacy Policy", "隐私政策")}</Link>
            </p>
          </form>
        )}
      </section>

      <VideoModal open={Boolean(videoSrc)} onClose={() => setVideoSrc(null)} src={videoSrc} />
      {active ? (
        <Suspense fallback={null}>
          <ManualModal open onClose={() => setActive(null)} manual={active} lang={lang} />
        </Suspense>
      ) : null}
    </div>
  );
}
