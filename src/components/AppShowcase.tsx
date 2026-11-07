import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Bluetooth, KeyRound, ScrollText } from "lucide-react";
import { useTranslation } from "react-i18next";

const ROTATE_MS = 5000;

const screens = [
  {
    src: "/images/app/mockup-iphone17-dashboard.png",
    titleKey: "appShowcase.cards.unlock.title",
    bodyKey: "appShowcase.cards.unlock.body",
    altKey: "appShowcase.cards.unlock.alt",
    icon: Bluetooth,
  },
  {
    src: "/images/app/mockup-iphone17-ekey.png",
    titleKey: "appShowcase.cards.ekey.title",
    bodyKey: "appShowcase.cards.ekey.body",
    altKey: "appShowcase.cards.ekey.alt",
    icon: KeyRound,
  },
  {
    src: "/images/app/mockup-iphone17-log.png",
    titleKey: "appShowcase.cards.log.title",
    bodyKey: "appShowcase.cards.log.body",
    altKey: "appShowcase.cards.log.alt",
    icon: ScrollText,
  },
] as const;

export function AppShowcase() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const stoppedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const arm = useCallback(() => {
    clearTimer();
    if (stoppedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = window.setInterval(() => {
      setActive((current) => (current + 1) % screens.length);
    }, ROTATE_MS);
  }, [clearTimer]);

  useEffect(() => {
    arm();
    return clearTimer;
  }, [arm, clearTimer]);

  function show(index: number) {
    stoppedRef.current = true;
    clearTimer();
    setActive(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + screens.length) % screens.length;
    show(next);
    document.getElementById(`app-showcase-tab-${next}`)?.focus();
  }

  return (
    <section className="app-showcase" aria-labelledby="app-showcase-title">
      <div className="v2-wrap app-showcase-grid">
        <div
          id="app-showcase-panel"
          className="app-phone-stage"
          role="tabpanel"
          aria-labelledby={`app-showcase-tab-${active}`}
          onPointerEnter={() => {
            if (!stoppedRef.current) clearTimer();
          }}
          onPointerLeave={() => {
            if (!stoppedRef.current) arm();
          }}
        >
          {screens.map((screen, index) => (
            <img
              key={screen.src}
              src={screen.src}
              alt={active === index ? t(screen.altKey) : ""}
              width={515}
              height={1024}
              className={active === index ? "is-active" : ""}
              aria-hidden={active !== index}
              draggable={false}
              decoding="async"
            />
          ))}
        </div>

        <div className="app-showcase-copy">
          <p className="app-eco-badge">
            <img src="/images/app/tuya-logo.png" alt="Tuya" width={265} height={252} />
            <span>{t("appShowcase.badge")}</span>
          </p>
          <h2 id="app-showcase-title">
            <span className="app-showcase-line">{t("appShowcase.headline")}</span>
            <span className="app-showcase-highlight">{t("appShowcase.highlight")}</span>
          </h2>
          <p className="app-showcase-subtitle">{t("appShowcase.subtitle")}</p>
          <div className="app-showcase-points" role="tablist" aria-label={t("appShowcase.tabsLabel")}>
            {screens.map((screen, index) => {
              const Icon = screen.icon;
              const selected = active === index;
              return (
                <button
                  key={screen.src}
                  type="button"
                  role="tab"
                  id={`app-showcase-tab-${index}`}
                  className={selected ? "app-point is-active" : "app-point"}
                  aria-selected={selected}
                  aria-controls="app-showcase-panel"
                  tabIndex={selected ? 0 : -1}
                  onPointerEnter={() => show(index)}
                  onFocus={() => show(index)}
                  onClick={() => show(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span className="app-point-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="app-point-copy">
                    <strong>{t(screen.titleKey)}</strong>
                    <p>{t(screen.bodyKey)}</p>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
