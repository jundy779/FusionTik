import { siteConfig } from "@/lib/site-config"

export const faqItems = [
  {
    question: "Apa itu FusionTik TikTok Downloader?",
    answer:
      "FusionTik adalah layanan web gratis untuk mendownload video TikTok tanpa watermark (MP4), mengunduh foto TikTok (Photo Mode), dan mengekstrak audio MP3 berkecepatan tinggi tanpa perlu instalasi aplikasi atau login.",
  },
  {
    question: "Apakah FusionTik benar-benar gratis dan tanpa watermark?",
    answer:
      "Ya, FusionTik 100% gratis tanpa biaya tersembunyi. Semua video TikTok yang diunduh akan otomatis bersih dari watermark logo TikTok.",
  },
  {
    question: "Format file apa saja yang didukung oleh FusionTik?",
    answer:
      "FusionTik mendukung format MP4 (video HD tanpa watermark), MP3 (audio musik TikTok), serta gambar JPG/PNG kualitas asli untuk postingan TikTok Photo Mode.",
  },
  {
    question: "Bagaimana cara download video TikTok tanpa watermark di FusionTik?",
    answer:
      "Cukup salin link postingan TikTok (vt.tiktok.com atau tiktok.com/@user/video/...), tempelkan ke kolom input di FusionTik, klik tombol Download, lalu pilih tombol UNDUH MP4 atau UNDUH MP3.",
  },
  {
    question: "Apakah FusionTik menyimpan video atau riwayat download saya?",
    answer:
      "Tidak. FusionTik tidak menyimpan file video di server. Semua file langsung diunduh dari CDN resmi TikTok. Riwayat download Anda disimpan secara privat di penyimpanan lokal browser Anda sendiri.",
  },
  {
    question: "Bisakah FusionTik digunakan di HP Android dan iPhone (iOS)?",
    answer:
      "Bisa. FusionTik kompatibel dengan semua perangkat (Android, iPhone/iPad, Windows, macOS, Linux) melalui browser web seperti Chrome, Safari, Firefox, dan Edge.",
  },
] as const

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/placeholder-logo.svg`,
    description: siteConfig.description,
    sameAs: ["https://www.wikidata.org/wiki/Q48008408"],
  }
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["id-ID", "en-US"],
    publisher: {
      "@type": "Organization",
      name: siteConfig.author,
    },
  }
}

export function buildWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Android, iOS, Windows, macOS, Linux)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: siteConfig.description,
    featureList: [
      "Download video TikTok tanpa watermark (MP4 HD)",
      "Ekstrak musik audio TikTok (MP3)",
      "Download gambar TikTok Photo Mode",
      "Tanpa login dan 100% gratis",
      "Kompatibel HP Android & iPhone",
    ],
    browserRequirements: "Requires JavaScript and HTML5",
  }
}

export function buildHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cara Download Video TikTok Tanpa Watermark di FusionTik",
    description:
      "Panduan langkah demi langkah mengunduh video, gambar, dan audio MP3 TikTok secara gratis dengan FusionTik.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Salin Link TikTok",
        text: "Buka aplikasi TikTok lalu salin link video atau foto (Photo Mode) yang ingin diunduh.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Tempelkan ke FusionTik",
        text: "Buka website FusionTik (fusiontik.vercel.app) lalu paste link tersebut ke kolom input.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Klik Tombol Download",
        text: "Tekan tombol Download untuk memproses konten secara cepat.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Simpan File Ke Perangkat",
        text: "Pilih opsi UNDUH MP4 (video tanpa watermark), UNDUH MP3 (audio), atau UNDUH GAMBAR.",
      },
    ],
  }
}

export function buildSpeakableSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "FusionTik TikTok Downloader",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#about h2", "#about p", "#faq h2"],
    },
    about: {
      "@type": "Thing",
      name: "TikTok",
      sameAs: "https://www.wikidata.org/wiki/Q48008408",
    },
  }
}

export function buildBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
    ],
  }
}

export function buildGlobalStructuredData() {
  return [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebApplicationSchema(),
    buildHowToSchema(),
    buildFaqSchema(),
    buildSpeakableSchema(),
    buildBreadcrumbSchema(),
  ]
}
