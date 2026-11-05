import { Battery, Fingerprint, History } from "lucide-react";
import { useTranslation } from "react-i18next";

const points = [
  {
    icon: Fingerprint,
    titleEn: "Visual Fingerprint Roster",
    titleZh: "指纹独立命名与管理",
    bodyEn: "Store up to 60 prints. Assign names, grant permissions, and revoke individual access instantly without resetting the device.",
    bodyZh: "高达 60 枚指纹按人命名分配，人员变动时一键单点删除，告别整锁重置烦恼。",
  },
  {
    icon: History,
    titleEn: "Time-Stamped Activity Logs",
    titleZh: "带时间戳的开锁日志",
    bodyEn: "Complete audit trail. Know exactly who unlocked your lock and at what time for enhanced accountability.",
    bodyZh: "详细记录每次开锁的人员与具体时刻，借还车与出入记录清清楚楚。",
  },
  {
    icon: Battery,
    titleEn: "Battery Health & Low Power Alerts",
    titleZh: "电量百分比实时查看",
    bodyEn: "Check real-time battery percentage on your screen so you're never left stranded.",
    bodyZh: "手机端随时监控电量，低电主动提醒，出行更安心。",
  },
] as const;

export function AppShowcase() {
  const { i18n } = useTranslation();
  const zh = i18n.language.startsWith("zh");
  const copy = (en: string, zhText: string) => (zh ? zhText : en);

  const prints = zh
    ? [
        { name: "陈晨", role: "主人" },
        { name: "林夏", role: "家人" },
        { name: "周宁", role: "访客" },
      ]
    : [
        { name: "Alex", role: "Owner" },
        { name: "Maya", role: "Family" },
        { name: "Sam", role: "Guest" },
      ];

  const logs = zh
    ? [
        { name: "陈晨", when: "今天 08:14" },
        { name: "林夏", when: "昨天 19:42" },
        { name: "周宁", when: "昨天 11:06" },
      ]
    : [
        { name: "Alex", when: "Today 08:14" },
        { name: "Maya", when: "Yesterday 19:42" },
        { name: "Sam", when: "Yesterday 11:06" },
      ];

  return (
    <section className="app-showcase" aria-labelledby="app-showcase-title">
      <div className="v2-wrap app-showcase-grid">
        <div className="app-phone">
          <div className="app-phone-screen">
            <div className="app-phone-status" aria-hidden="true">
              <span>9:41</span>
              <span className="app-phone-battery">78%</span>
            </div>
            <div className="app-phone-device">
              <p>Tuya Smart</p>
              <strong>CLX1</strong>
            </div>
            <div className="app-phone-meter">
              <span>{copy("Battery", "电量")}</span>
              <b>78%</b>
              <i />
            </div>
            <p className="app-phone-label">{copy("Fingerprints", "指纹")}</p>
            <ul className="app-phone-prints">
              {prints.map((person) => (
                <li key={person.name}>
                  <span aria-hidden="true">{person.name.slice(0, 1)}</span>
                  <strong>{person.name}</strong>
                  <em>{person.role}</em>
                </li>
              ))}
            </ul>
            <p className="app-phone-label">{copy("Unlock history", "开锁记录")}</p>
            <ul className="app-phone-logs">
              {logs.map((entry) => (
                <li key={entry.when}>
                  <i aria-hidden="true" />
                  <strong>{entry.name}</strong>
                  <time>{entry.when}</time>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="app-showcase-copy">
          <h2 id="app-showcase-title">
            {copy("Total Control at Your Fingertips. Powered by Tuya Smart.", "掌上可视化掌控，尽享 App 智能生态")}
          </h2>
          <ul className="app-showcase-points">
            {points.map((point) => (
              <li key={point.titleEn} className="app-point">
                <span className="app-point-icon" aria-hidden="true">
                  <point.icon size={20} strokeWidth={1.75} />
                </span>
                <div>
                  <strong>{copy(point.titleEn, point.titleZh)}</strong>
                  <p>{copy(point.bodyEn, point.bodyZh)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
