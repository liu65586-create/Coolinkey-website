export const SITE_ORIGIN = "https://www.coolinkey.com";

type RouteSeo = {
  path: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  image: string;
};

const HOME_DESCRIPTION =
  "Fingerprint smart chain lock with app control, a mechanical key and IP67 protection. Steel wire 6 mm. Chain perimeter 100 cm.";
const HOME_DESCRIPTION_ZH =
  "指纹智能链条锁，支持 App 管理与机械钥匙，IP67 防护。钢丝直径 6 mm，链周长 100 cm。";

export const ROUTE_SEO: RouteSeo[] = [
  {
    path: "/",
    title: "COOLINKEY CLX1 | Fingerprint Smart Chain Lock",
    titleZh: "COOLINKEY CLX1 | 指纹智能链条锁",
    description: HOME_DESCRIPTION,
    descriptionZh: HOME_DESCRIPTION_ZH,
    image: `${SITE_ORIGIN}/images/listing/ebike-locking-wide.jpg`,
  },
  {
    path: "/business",
    title: "Business Partnerships & Inquiries | COOLINKEY",
    titleZh: "商务合作与咨询 | COOLINKEY",
    description: "Contact COOLINKEY about distribution, retail, and other business inquiries.",
    descriptionZh: "联系 COOLINKEY，咨询分销、零售与其他商务合作。",
    image: `${SITE_ORIGIN}/images/listing/meet-clx1.jpg`,
  },
  {
    path: "/privacy",
    title: "Privacy Policy | COOLINKEY",
    titleZh: "隐私政策 | COOLINKEY",
    description: "How COOLINKEY handles personal information on this website.",
    descriptionZh: "COOLINKEY 如何处理本网站上的个人信息。",
    image: `${SITE_ORIGIN}/images/listing/meet-clx1.jpg`,
  },
  {
    path: "/cookie-policy",
    title: "GDPR & Cookie Statement | COOLINKEY",
    titleZh: "GDPR 与 Cookie 声明 | COOLINKEY",
    description: "How COOLINKEY uses cookies on this website.",
    descriptionZh: "COOLINKEY 如何在本网站使用 Cookie。",
    image: `${SITE_ORIGIN}/images/listing/meet-clx1.jpg`,
  },
];

export function seoForPath(pathname: string): RouteSeo {
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/";
  return ROUTE_SEO.find((item) => item.path === path) ?? ROUTE_SEO[0];
}

function absolute(path: string): string {
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}`;
}

function jsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

export function headMarkup(pathname: string): string {
  const seo = seoForPath(pathname);
  const url = absolute(seo.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: "COOLINKEY",
      url: `${SITE_ORIGIN}/`,
      email: "support@coolinkey.com",
      logo: `${SITE_ORIGIN}/favicon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: "COOLINKEY",
      inLanguage: ["en", "zh"],
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    },
  ];
  if (seo.path === "/") {
    graph.push({
      "@type": "Product",
      name: "CLX1 Smart Chain Lock",
      brand: { "@type": "Brand", "name": "COOLINKEY" },
      category: "Smart chain lock",
      description: HOME_DESCRIPTION,
      image: [
        `${SITE_ORIGIN}/images/listing/meet-clx1.jpg`,
        `${SITE_ORIGIN}/images/listing/ebike-locking-wide.jpg`,
      ],
      url: `${SITE_ORIGIN}/#clx1`,
    });
  } else {
    graph.push({
      "@type": "WebPage",
      name: seo.title,
      description: seo.description,
      url,
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      inLanguage: "en",
    });
  }

  return [
    `<title>${seo.title}</title>`,
    `<meta name="description" content="${seo.description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="COOLINKEY" />`,
    `<meta property="og:title" content="${seo.title}" />`,
    `<meta property="og:description" content="${seo.description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${seo.image}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:locale:alternate" content="zh_CN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="alternate" hreflang="en" href="${url}" />`,
    `<link rel="alternate" hreflang="zh" href="${url}${url.includes("?") ? "&" : "?"}lang=zh" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    jsonLdScript({ "@context": "https://schema.org", "@graph": graph }),
  ].join("\n    ");
}
