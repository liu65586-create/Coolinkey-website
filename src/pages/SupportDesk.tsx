import { useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { About } from "./About";

function copy(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

type Fields = { fullName: string; email: string; message: string; companyFax: string };
const EMPTY: Fields = { fullName: "", email: "", message: "", companyFax: "" };
type Status = "idle" | "submitting" | "sent" | "draft" | "error";

export function SupportDesk() {
  const { i18n } = useTranslation();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const email = config?.contact?.email?.trim() || "support@coolinkey.com";
  const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT?.trim() || "";
  const formId = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

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
      document.getElementById(first === "fullName" ? "support-message-name" : `${formId}-${first}`)?.focus();
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
      sourcePage: "/#help",
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
    <section id="help" className="site-anchor" tabIndex={-1}>
      <About />
      <div className="desk-stack page-wrap">
        <div id="support-message" className="desk-ask" aria-labelledby="desk-ask-title" tabIndex={-1}>
          <div className="desk-copy">
            <p className="desk-kicker">{copy(lang, "Support", "支持")}</p>
            <h2 id="desk-ask-title">{copy(lang, "Still can't find what you're looking for?", "还是找不到您要找的东西？")}</h2>
            <p>{copy(lang, "If the questions above don't cover it, leave a message here.", "如果常见问题里没有你要找的答案，可以在这里留言。")}</p>
            <p>
              {copy(lang, "For anything about CLX1, email ", "对 CLX1 有任何疑问，请发送邮件至 ")}
              <a href={`mailto:${email}`}>{email}</a>
              {copy(lang, ".", "。")}
            </p>
          </div>
          {status === "sent" ? (
            <div className="desk-form-card">
              <p role="status">{copy(lang, "Your message has been submitted.", "你的留言已提交。")}</p>
            </div>
          ) : (
            <form className="desk-form-card" onSubmit={onSubmit} noValidate>
              <div className="desk-fields">
                <label htmlFor="support-message-name">
                  <span className="sr-only">{copy(lang, "Name", "姓名")}</span>
                  <input
                    id="support-message-name"
                    name="fullName"
                    autoComplete="name"
                    placeholder={copy(lang, "Name", "姓名")}
                    value={fields.fullName}
                    aria-invalid={Boolean(errors.fullName)}
                    onChange={(event) => set("fullName", event.target.value)}
                  />
                  {errors.fullName ? <span>{errors.fullName}</span> : null}
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
                    onChange={(event) => set("email", event.target.value)}
                  />
                  {errors.email ? <span>{errors.email}</span> : null}
                </label>
                <label className="desk-message" htmlFor={`${formId}-message`}>
                  <span className="sr-only">{copy(lang, "Message", "信息")}</span>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    placeholder={copy(lang, "Message", "信息")}
                    value={fields.message}
                    aria-invalid={Boolean(errors.message)}
                    onChange={(event) => set("message", event.target.value)}
                  />
                  {errors.message ? <span>{errors.message}</span> : null}
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
                <p className="desk-note">
                  {copy(
                    lang,
                    `Submitting opens an email to ${email}. This page cannot confirm delivery.`,
                    `提交后会打开写给 ${email} 的邮件。此页面无法确认是否已发出。`,
                  )}
                </p>
              )}
              {status === "draft" ? (
                <p className="desk-note" role="status">
                  {copy(lang, "Your email app should now have this message ready. Send it to complete the request.", "邮件应用中应已准备好这封留言。发送后即完成。")}
                </p>
              ) : null}
              {status === "error" ? (
                <p className="desk-error" role="alert">
                  {copy(lang, "The message could not be submitted. Please try again.", "留言未能提交，请再试一次。")}
                </p>
              ) : null}
              <p className="desk-note">
                <Link to="/privacy">{copy(lang, "Privacy Policy", "隐私政策")}</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
