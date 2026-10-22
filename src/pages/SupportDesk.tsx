import { useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { About } from "./About";

function copy(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

const INQUIRY_TYPES = [
  { id: "product", en: "Product question", zh: "产品问题" },
  { id: "setup", en: "Setup or troubleshooting", zh: "设置或故障排查" },
  { id: "order", en: "Order or purchase inquiry", zh: "订单或购买咨询" },
  { id: "business", en: "Business inquiry", zh: "商务咨询" },
  { id: "other", en: "Other", zh: "其他" },
] as const;

type Fields = { fullName: string; email: string; inquiryType: string; message: string; companyFax: string };
const EMPTY: Fields = { fullName: "", email: "", inquiryType: "", message: "", companyFax: "" };
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
    if (!fields.message.trim()) next.message = copy(lang, "Please enter a message.", "请填写留言。");
    setErrors(next);
    const first = (Object.keys(next) as (keyof Fields)[])[0];
    if (first) {
      const fieldId = first === "fullName" ? "support-message-name" : `${formId}-${first}`;
      document.getElementById(fieldId)?.focus();
      return;
    }
    if (fields.companyFax.trim()) {
      setStatus("error");
      return;
    }

    const inquiry = INQUIRY_TYPES.find((item) => item.id === fields.inquiryType);
    const inquiryLabel = inquiry ? copy(lang, inquiry.en, inquiry.zh) : "";
    const payload = {
      fullName: fields.fullName.trim(),
      email: fields.email.trim(),
      message: fields.message.trim(),
      ...(inquiry ? { inquiryType: inquiry.id, inquiryLabel } : {}),
      source: "coolinkey_website",
      sourcePage: "/#help",
      lang,
      topic: "support",
    };

    if (endpoint) {
      setStatus("submitting");
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
    const body = [
      ...(inquiryLabel ? [`Inquiry type: ${inquiryLabel}`] : []),
      `Name: ${payload.fullName}`,
      `Email: ${payload.email}`,
      "",
      payload.message,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("draft");
  };

  return (
    <section id="help" className="site-anchor" tabIndex={-1}>
      <div className="desk-stack page-wrap">
        <div id="contact" className="site-anchor" tabIndex={-1}>
          <div id="support-message" className="desk-ask" aria-labelledby="desk-ask-title" tabIndex={-1}>
            <div className="desk-copy">
              <h2 id="desk-ask-title">{copy(lang, "Still Need Help?", "还需要帮助？")}</h2>
              <p>
                {copy(
                  lang,
                  "Tell us what you need help with, and we'll do our best to point you in the right direction.",
                  "告诉我们你需要什么帮助，我们会尽量为你指出方向。",
                )}
              </p>
              <p>
                {copy(lang, "You can also email ", "也可以直接发送邮件至 ")}
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
                    {copy(lang, "Name", "姓名")}
                    <input
                      id="support-message-name"
                      name="fullName"
                      autoComplete="name"
                      value={fields.fullName}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? "support-message-name-error" : undefined}
                      onChange={(event) => set("fullName", event.target.value)}
                    />
                    {errors.fullName ? <span id="support-message-name-error">{errors.fullName}</span> : null}
                  </label>
                  <label htmlFor={`${formId}-email`}>
                    {copy(lang, "Email", "电子邮箱")}
                    <input
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={fields.email}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                      onChange={(event) => set("email", event.target.value)}
                    />
                    {errors.email ? <span id={`${formId}-email-error`}>{errors.email}</span> : null}
                  </label>
                  <label className="desk-inquiry" htmlFor={`${formId}-inquiryType`}>
                    {copy(lang, "Inquiry Type (optional)", "咨询类型（可选）")}
                    <select
                      id={`${formId}-inquiryType`}
                      name="inquiryType"
                      value={fields.inquiryType}
                      onChange={(event) => set("inquiryType", event.target.value)}
                    >
                      <option value="">{copy(lang, "Select a type", "选择类型")}</option>
                      {INQUIRY_TYPES.map((item) => (
                        <option key={item.id} value={item.id}>{copy(lang, item.en, item.zh)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="desk-message" htmlFor={`${formId}-message`}>
                    {copy(lang, "Message", "留言")}
                    <textarea
                      id={`${formId}-message`}
                      name="message"
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
                  {status === "submitting"
                    ? copy(lang, "Sending...", "正在发送...")
                    : copy(lang, "Send message", "发送消息")}
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
      </div>
      <About />
    </section>
  );
}
