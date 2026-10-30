import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";

const TYPES = [
  ["distribution", "Distribution & Wholesale", "分销与批发"],
  ["retail", "Retail & E-commerce", "零售与电商"],
  ["corporate", "Corporate & Bulk Purchasing", "企业与批量采购"],
  ["partnership", "Brand & Strategic Partnerships", "品牌与战略合作"],
  ["other", "Other Business Opportunities", "其他商务机会"],
] as const;

type TypeId = (typeof TYPES)[number][0];

type Fields = {
  fullName: string;
  workEmail: string;
  companyName: string;
  country: string;
  inquiryType: TypeId | "";
  message: string;
  website: string;
  volume: string;
  companyFax: string;
};

const EMPTY: Fields = {
  fullName: "",
  workEmail: "",
  companyName: "",
  country: "",
  inquiryType: "",
  message: "",
  website: "",
  volume: "",
  companyFax: "",
};

type Status = "idle" | "submitting" | "sent" | "draft" | "error";

function copy(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

function typeLabel(lang: Lang, id: TypeId | "") {
  const row = TYPES.find((item) => item[0] === id);
  if (!row) return "";
  return copy(lang, row[1], row[2]);
}

function validate(fields: Fields, lang: Lang) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  const need = (key: keyof Fields, en: string, zh: string) => {
    errors[key] = copy(lang, en, zh);
  };
  if (!fields.fullName.trim()) need("fullName", "Please enter your full name.", "请填写姓名。");
  if (!fields.workEmail.trim()) need("workEmail", "Please enter a work email address.", "请填写工作邮箱。");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.workEmail.trim())) {
    need("workEmail", "Please enter a valid email address.", "请填写有效的邮箱地址。");
  }
  if (!fields.companyName.trim()) need("companyName", "Please enter your company name.", "请填写公司名称。");
  if (!fields.country.trim()) need("country", "Please enter a country or region.", "请填写国家或地区。");
  if (!fields.inquiryType) need("inquiryType", "Please choose what you would like to discuss.", "请选择希望讨论的内容。");
  if (!fields.message.trim()) need("message", "Please enter a message.", "请填写留言。");
  return errors;
}

function payloadOf(fields: Fields, lang: Lang) {
  return {
    fullName: fields.fullName.trim(),
    workEmail: fields.workEmail.trim(),
    companyName: fields.companyName.trim(),
    country: fields.country.trim(),
    inquiryType: fields.inquiryType,
    inquiryLabel: typeLabel(lang, fields.inquiryType),
    message: fields.message.trim(),
    companyWebsite: fields.website.trim(),
    estimatedOrderVolume: fields.volume.trim(),
    source: "coolinkey_website",
    sourcePage: "/business",
    lang,
  };
}

function mailtoHref(email: string, fields: Fields, lang: Lang) {
  const data = payloadOf(fields, lang);
  const subject = `COOLINKEY business inquiry: ${data.inquiryLabel}`;
  const body = [
    `Name: ${data.fullName}`,
    `Work email: ${data.workEmail}`,
    `Company: ${data.companyName}`,
    `Country / region: ${data.country}`,
    `Inquiry type: ${data.inquiryLabel}`,
    `Company website: ${data.companyWebsite || "—"}`,
    `Estimated order volume: ${data.estimatedOrderVolume || "—"}`,
    `Source page: ${data.sourcePage}`,
    "",
    data.message,
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function BusinessInquiry() {
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
    const nextErrors = validate(fields, lang);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(`${formId}-${firstInvalid}`)?.focus();
      return;
    }
    if (fields.companyFax.trim()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payloadOf(fields, lang)),
        });
        if (!response.ok) throw new Error("http");
        setStatus("sent");
      } catch {
        setStatus("error");
      }
      return;
    }

    window.location.href = mailtoHref(email, fields, lang);
    setStatus("draft");
  };

  return (
    <div className="business-inquiry page-wrap">
      <div className="v2-split">
        <div>
          <p className="v2-eyebrow">{copy(lang, "For Business", "面向商务")}</p>
          <h1>{copy(lang, "Let's Talk About Working Together", "我们来谈谈合作")}</h1>
          <p className="v2-lead">
            {copy(
              lang,
              "Whether you're exploring distribution, retail opportunities, corporate purchasing or another business collaboration, tell us a little about your needs and we'll review your inquiry",
              "无论你在了解分销、零售、企业采购，还是其他商务合作，告诉我们你的需求，我们会查看你的咨询",
            )}
          </p>
        </div>

        {status === "sent" ? (
          <div>
            <p className="v2-lead" style={{ marginTop: 0 }}>
              {copy(
                lang,
                "Thank you for your interest in COOLINKEY. Your inquiry has been submitted successfully.",
                "感谢你对 COOLINKEY 的关注。你的咨询已成功提交。",
              )}
            </p>
            <Link className="v2-btn v2-btn-primary" to="/" style={{ marginTop: 24 }}>
              {copy(lang, "Back to home", "返回首页")}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <Field
              id={`${formId}-fullName`}
              label={copy(lang, "Full Name", "姓名")}
              error={errors.fullName}
            >
              <input
                id={`${formId}-fullName`}
                name="fullName"
                autoComplete="name"
                value={fields.fullName}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? `${formId}-fullName-error` : undefined}
                onChange={(event) => set("fullName", event.target.value)}
              />
            </Field>
            <Field
              id={`${formId}-workEmail`}
              label={copy(lang, "Work Email", "工作邮箱")}
              error={errors.workEmail}
            >
              <input
                id={`${formId}-workEmail`}
                name="workEmail"
                type="email"
                autoComplete="email"
                value={fields.workEmail}
                aria-invalid={Boolean(errors.workEmail)}
                aria-describedby={errors.workEmail ? `${formId}-workEmail-error` : undefined}
                onChange={(event) => set("workEmail", event.target.value)}
              />
            </Field>
            <Field
              id={`${formId}-companyName`}
              label={copy(lang, "Company Name", "公司名称")}
              error={errors.companyName}
            >
              <input
                id={`${formId}-companyName`}
                name="companyName"
                autoComplete="organization"
                value={fields.companyName}
                aria-invalid={Boolean(errors.companyName)}
                aria-describedby={errors.companyName ? `${formId}-companyName-error` : undefined}
                onChange={(event) => set("companyName", event.target.value)}
              />
            </Field>
            <Field
              id={`${formId}-country`}
              label={copy(lang, "Country / Region", "国家 / 地区")}
              error={errors.country}
            >
              <input
                id={`${formId}-country`}
                name="country"
                autoComplete="country-name"
                value={fields.country}
                aria-invalid={Boolean(errors.country)}
                aria-describedby={errors.country ? `${formId}-country-error` : undefined}
                onChange={(event) => set("country", event.target.value)}
              />
            </Field>
            <Field
              id={`${formId}-inquiryType`}
              label={copy(lang, "What would you like to discuss?", "你希望讨论什么？")}
              error={errors.inquiryType}
            >
              <select
                id={`${formId}-inquiryType`}
                name="inquiryType"
                value={fields.inquiryType}
                aria-invalid={Boolean(errors.inquiryType)}
                aria-describedby={errors.inquiryType ? `${formId}-inquiryType-error` : undefined}
                onChange={(event) => set("inquiryType", event.target.value)}
              >
                <option value="">{copy(lang, "Select an inquiry type", "选择咨询类型")}</option>
                {TYPES.map(([id, en, zh]) => (
                  <option key={id} value={id}>
                    {copy(lang, en, zh)}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              id={`${formId}-website`}
              label={copy(lang, "Company Website (optional)", "公司网站（选填）")}
            >
              <input
                id={`${formId}-website`}
                name="website"
                type="url"
                autoComplete="url"
                value={fields.website}
                onChange={(event) => set("website", event.target.value)}
              />
            </Field>
            <Field
              id={`${formId}-volume`}
              label={copy(lang, "Estimated Order Volume (optional)", "预计订单量（选填）")}
            >
              <input
                id={`${formId}-volume`}
                name="volume"
                value={fields.volume}
                onChange={(event) => set("volume", event.target.value)}
              />
            </Field>
            <Field id={`${formId}-message`} label={copy(lang, "Message", "留言")} error={errors.message}>
              <textarea
                id={`${formId}-message`}
                name="message"
                value={fields.message}
                placeholder={copy(
                  lang,
                  "Tell us a little about your company and what you'd like to explore.",
                  "简单介绍公司和你希望了解的合作。",
                )}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? `${formId}-message-error` : undefined}
                onChange={(event) => set("message", event.target.value)}
              />
            </Field>
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
            <p className="privacy-note">
              {copy(
                lang,
                "We use these details only to review your inquiry. See the ",
                "我们仅使用这些信息来查看你的咨询。详见",
              )}
              <Link to="/privacy">{copy(lang, "Privacy Policy", "隐私政策")}</Link>
              {copy(lang, ".", "。")}
            </p>
            {endpoint ? null : (
              <p className="form-note">
                {copy(
                  lang,
                  `Submitting opens an email to ${email}. Send that message to deliver your inquiry. This page cannot confirm delivery.`,
                  `提交后会打开写给 ${email} 的邮件。发送该邮件后，咨询才会送达。此页面无法确认是否已发出。`,
                )}
              </p>
            )}
            {status === "draft" ? (
              <p className="form-note" role="status">
                {copy(
                  lang,
                  "Your email app should now have this inquiry ready. Send the message to complete it.",
                  "邮件应用中应已准备好这封咨询。发送后即完成。",
                )}
              </p>
            ) : null}
            {status === "error" ? (
              <p className="form-error" role="alert">
                {copy(lang, "The inquiry could not be submitted. Please try again.", "咨询未能提交，请再试一次。")}
              </p>
            ) : null}
            <button className="v2-btn v2-btn-primary" type="submit" disabled={status === "submitting"}>
              {copy(lang, "Send inquiry", "发送咨询")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id}>
      {label}
      {children}
      {error ? (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
