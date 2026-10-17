import type { HomeDesignCopy } from "../types/siteConfig";

export const homeDesignDefaults: HomeDesignCopy = {
  heroEyebrow: { en: "SMART SECURITY, SIMPLIFIED", zh: "智能安防，简单自在" },
  heroProofFingerprint: { en: "Fingerprint access", zh: "指纹解锁" },
  heroProofBackup: { en: "Mechanical backup key", zh: "机械钥匙备份" },
  heroImageCaption: { en: "Made for everyday rides", zh: "为日常骑行设计" },
  detailEyebrow: { en: "DETAILS THAT MATTER", zh: "每个细节，都为安心而设计" },
  detailTitle: { en: "Thoughtful details. Everyday confidence.", zh: "每个细节，都为安心而设计" },
  detailIntro: { en: "From easy access to emergency backup, the essentials are designed to feel intuitive in everyday use.", zh: "从便捷解锁到应急备份，重要功能清晰、直观，也更容易融入日常。" },
  details: [
    { id: "access", image: "/images/listing/product-clx1-isolated.jpg", eyebrow: { en: "01 / ACCESS", zh: "01 / 解锁" }, title: { en: "One touch. You're in.", zh: "一触即开" }, body: { en: "Fingerprint access, without reaching for a key.", zh: "指纹识别，让解锁更简单。" } },
    { id: "backup", image: "/images/listing/bike-locking-closeup.jpg", eyebrow: { en: "02 / BACKUP", zh: "02 / 备份" }, title: { en: "A backup when it matters", zh: "关键时刻，有备份" }, body: { en: "A mechanical key is there for emergencies.", zh: "紧急情况下可使用机械钥匙解锁。" } },
    { id: "connect", image: "/images/listing/glass-door-locking.jpg", eyebrow: { en: "03 / CONNECT", zh: "03 / 互联" }, title: { en: "Control from your phone", zh: "掌控在你手中" }, body: { en: "Manage access with the companion app.", zh: "通过 App 管理访问权限。" } }
  ],
  scenarioEyebrow: { en: "ONE LOCK, MANY ROUTINES", zh: "多种日常场景" },
  scenarioFooter: { en: "Designed for bicycles, e-bikes and everyday securing needs", zh: "为自行车、电助力自行车及日常固定物品设计" },
  appEyebrow: { en: "CONNECTED CONTROL", zh: "智能互联" },
  appPointOne: { en: "App management", zh: "手机管理" },
  appPointTwo: { en: "Convenient access sharing", zh: "便捷授权" },
  closingEyebrow: { en: "READY FOR YOUR NEXT RIDE", zh: "准备好开启下一段旅程" },
  closingTitle: { en: "You focus on freedom.\nWe focus on security.", zh: "你专注自由。\n我们专注守护。" }
};
