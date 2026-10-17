import type { Bilingual } from "../types/siteConfig";

export function bi(en: string, zh: string): Bilingual {
  return { en, zh };
}

export const copyDefaults = {
  nav: [
    { id: "nav-home", label: bi("Home", "首页"), to: "/" },
    { id: "nav-product", label: bi("CLX1", "CLX1"), to: "/product" },
    { id: "nav-support", label: bi("Support", "支持"), to: "/support" },
    { id: "nav-about", label: bi("About", "关于"), to: "/about" },
  ],
  footer: {
    tagline: bi("Smart Lock for a Freer You.", "让出行更自由的智能锁。"),
    privacy: bi("Privacy Policy", "隐私政策"),
    cookie: bi("GDPR & Cookie Statement", "GDPR 与 Cookie 声明"),
    icp: bi("ICP备XXXX号", "ICP备XXXX号"),
  },
  heroButtons: {
    discover: bi("Discover CLX1", "了解 CLX1"),
    watch: bi("Watch Video", "观看视频"),
  },
  spotlight: {
    kicker: bi("CLX1", "CLX1"),
    title: bi("Heavy-Duty Smart Chain Lock", "重型智能链条锁"),
    body: bi(
      "A A smart chain lock with fingerprint access, app management, IP67 protection, and a mechanical backup key. Steel wire diameter: 6 mm.",
      "集指纹解锁、App 管理、IP67 防护与机械钥匙备份于一体的智能链条锁。钢丝直径：6 mm。"
    ),
    specChain: bi("6mm", "6mm"),
    specChainLabel: bi("Steel Wire Diameter", "钢丝直径"),
    specIp: bi("IP67", "IP67"),
    specIpLabel: bi("Waterproof", "防水等级"),
    specLen: bi("100cm", "100cm"),
    specLenLabel: bi("Chain Length", "链条长度"),
    learnMore: bi("Learn More", "了解更多"),
  },
  scenarios: {
    kicker: bi("Wide applications", "广泛场景"),
    title: bi("More Than Just Bikes", "不止是自行车"),
    body: bi(
      "From bicycles to e-bikes, doors to gates — one lock, endless possibilities.",
      "从公路车到电动车，从玻璃门到铁门 — 一把锁，多种可能。"
    ),
    viewAll: bi("View All Scenarios", "查看全部场景"),
    items: [
      { id: "scenario-bicycle", image: "/images/lifestyle/scenario-bicycle.jpg", label: bi("Bicycles", "自行车") },
      { id: "scenario-ebike", image: "/images/lifestyle/scenario-ebike.jpg", label: bi("E-bikes", "电动车") },
      { id: "scenario-glass", image: "/images/lifestyle/scenario-glass.jpg", label: bi("Glass Doors", "玻璃门") },
      { id: "scenario-gate", image: "/images/lifestyle/scenario-gate.jpg", label: bi("Metal Gates", "铁门") },
    ],
  },
  appBanner: {
    kicker: bi("Smart control", "智能控制"),
    title: bi("More Than Just Bikes", "不止是自行车"),
    body: bi("Lock, unlock, and share — from your phone.", "上锁、解锁、分享授权 — 都在手机里完成。"),
    appStore: bi("App Store", "App Store"),
    googlePlay: bi("Google Play", "Google Play"),
    image: "/images/lifestyle/app-landscape.jpg",
  },
  support: {
    kicker: bi("Support", "支持"),
    title: bi("Get started. Stay confident.", "轻松上手。始终安心。"),
    subtitle: bi(
      "Everything you need to set up, use and troubleshoot your coolinkey. Find manuals, videos and step-by-step guides — all in one place.",
      "设置、使用与排查 coolinkey 所需的一切都在这里。说明书、视频与分步指南，集中查阅。"
    ),
    quickStart: bi("Quick Start", "快速开始"),
    quickStartHint: bi("Get up and running in minutes.", "几分钟完成设置。"),
    guides: bi("User Guides & Downloads", "用户指南与下载"),
    guidesHint: bi("Manuals and PDFs for your CLX1.", "CLX1 说明书与 PDF。"),
    videos: bi("Video Guides", "视频指南"),
    videosHint: bi("Watch and learn, in real time.", "跟着演示一步到位。"),
    troubleshooting: bi("Troubleshooting", "常见问题"),
    troubleshootingHint: bi("Solve common issues quickly.", "快速解决常见状况。"),
    helpTitle: bi("Still need help?", "还需要帮助？"),
    helpBody: bi("Our support team is here for you.", "支持团队随时为你服务。"),
    contactCta: bi("Contact Support", "联系支持"),
    steps: [
      { id: "support-step-1", title: bi("Charge first", "先充电"), hint: bi("Set up and learning in minutes.", "几分钟完成开机准备。") },
      { id: "support-step-2", title: bi("Connect the app", "连接 App"), hint: bi("Pair over Bluetooth 5.0.", "通过蓝牙 5.0 配对。") },
      { id: "support-step-3", title: bi("Add a fingerprint", "录入指纹"), hint: bi("Register up to 60 prints.", "最多支持 60 枚指纹。") },
      { id: "support-step-4", title: bi("Touch to unlock", "触摸解锁"), hint: bi("One-touch access, no keys.", "一触即开，无需钥匙。") },
    ],
    faqs: [
      {
        id: "support-faq-1",
        question: bi("Fingerprint recognition fails", "指纹识别失败"),
        answer: bi(
          "Dry or clean the sensor, then re-enrol the print with even pressure. Avoid moisture and heavy gloves during setup.",
          "擦干并清洁传感器，再以均匀力度重新录入。设置时避免潮湿或厚手套。"
        ),
      },
      {
        id: "support-faq-2",
        question: bi("Charging / power issues", "充电 / 供电问题"),
        answer: bi(
          "Use a USB-C cable. If the lock is fully drained, connect a power bank to the Type-C port to unlock, then charge fully.",
          "请使用 USB-C 线。若电量耗尽，可用充电宝连接 Type-C 口应急开锁，再完整充电。"
        ),
      },
      {
        id: "support-faq-3",
        question: bi("Using the mechanical key", "使用机械钥匙"),
        answer: bi(
          "The backup key is for emergencies. Insert fully, turn firmly, then store the key separately from the lock.",
          "备用钥匙仅用于应急。完全插入后用力转动，平时请与锁分开存放。"
        ),
      },
    ],
  },
};
