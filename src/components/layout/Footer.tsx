import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useShoppingRegion, type ShoppingRegionMode } from "../../context/ShoppingRegionContext";

function WeChatIcon({ label }: { label: string }) {
  return (
    <span
      className="pointer-events-none inline-flex h-10 w-10 cursor-default items-center justify-center rounded-md bg-[#1a1a1a] text-[#777777] hover:text-[#777777]"
      aria-label={label}
      title={label}
    >
      {/* TODO: integrate WeChat ecosystem. */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8.5 10c.8 0 1.5-.7 1.5-1.5S9.3 7 8.5 7 7 7.7 7 8.5 7.7 10 8.5 10Zm7 0c.8 0 1.5-.7 1.5-1.5S16.3 7 15.5 7 14 7.7 14 8.5s.7 1.5 1.5 1.5Z"
          fill="currentColor"
        />
        <path
          d="M12 3C7 3 3 6.6 3 11c0 2.2 1.1 4.1 2.8 5.4L5 21l4.7-2.4c.8.2 1.6.4 2.4.4 5 0 9-3.6 9-8s-4-8-9-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    </span>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const { mode, setMode } = useShoppingRegion();

  const onRegionChange = (next: ShoppingRegionMode) => {
    setMode(next);
  };

  return (
    <footer className="border-t border-[rgba(255,255,255,0.1)] bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white">© COOLINKEY</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link className="text-[#00b51a] hover:underline" to="/privacy">
              {t("footer.privacy")}
            </Link>
            <Link className="text-[#00b51a] hover:underline" to="/cookie-policy">
              {t("footer.cookie")}
            </Link>
            <a className="text-[#00b51a] hover:underline" href="mailto:support@coolinkey.com">
              support@coolinkey.com
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* TODO: integrate WeChat ecosystem. */}
            <WeChatIcon label="WeChat Official Account (placeholder)" />
            <WeChatIcon label="WeChat Mini Program (placeholder)" />
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="text-xs text-[#cccccc]">{t("footer.shoppingRegion")}</div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["auto", t("footer.regionAuto")],
                  ["cn", t("footer.regionCn")],
                  ["global", t("footer.regionGlobal")],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onRegionChange(key)}
                  className={[
                    "rounded-[8px] border px-3 py-2 text-xs font-semibold transition-colors",
                    mode === key
                      ? "border-[#00b51a] bg-[rgba(0,181,26,0.12)] text-white"
                      : "border-[rgba(255,255,255,0.15)] text-white hover:border-[#00b51a] hover:text-[#00b51a]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-[#888888]">{t("footer.icp")}</div>
      </div>
    </footer>
  );
}
