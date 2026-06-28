import { siteConfig } from "@/lib/site-config"

export const faqItems = [
  {
    question: "Is FusionTik free to use?",
    answer:
      "Yes. FusionTik is a free TikTok downloader with no hidden fees, subscriptions, or login required.",
  },
  {
    question: "Can I download TikTok videos without watermark?",
    answer:
      "Yes. FusionTik downloads TikTok videos without the TikTok watermark in MP4 format when the source video is available.",
  },
  {
    question: "What formats does FusionTik support?",
    answer:
      "FusionTik supports MP4 video downloads, MP3 audio extraction, and JPG/PNG image downloads for TikTok Photo Mode posts.",
  },
  {
    question: "Does FusionTik store my downloads?",
    answer:
      "No. FusionTik does not store downloaded files on its servers. Media is fetched directly from TikTok CDN. Download history is saved locally in your browser only.",
  },
  {
    question: "How do I download a TikTok video with FusionTik?",
    answer:
      "Copy the TikTok video or photo link, paste it into FusionTik, click Download, then choose MP4, MP3, or image download.",
  },
  {
    question: "Is it legal to download TikTok videos?",
    answer:
      "Downloading for personal offline use is generally acceptable, but you must respect copyright and the original creator. Do not redistribute or use content commercially without permission.",
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
    description: siteConfig.description,
    sameAs: [],
  }
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["en", "id"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function buildWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: siteConfig.description,
    featureList: [
      "Download TikTok videos without watermark (MP4)",
      "Extract TikTok audio (MP3)",
      "Download TikTok Photo Mode images",
      "No login required",
      "Free to use",
    ],
    browserRequirements: "Requires JavaScript",
  }
}

export function buildHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to download TikTok videos without watermark using FusionTik",
    description:
      "Step-by-step guide to download TikTok videos, photos, and audio for free with FusionTik.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy TikTok link",
        text: "Open TikTok and copy the share link of the video or photo post you want to download.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste into FusionTik",
        text: "Go to FusionTik and paste the TikTok URL into the input field.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Click Download",
        text: "Click the Download button and wait for FusionTik to process the link.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Save your file",
        text: "Choose MP4 for video, MP3 for audio, or download all images for Photo Mode posts.",
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
  ]
}
