import type { BlogPost, Settings } from "./types";

export const CATEGORIES = [
  { id: "earbuds", name: "Wireless Earbuds", blurb: "True wireless, deep bass, ENC calls" },
  { id: "headphones", name: "Bluetooth Headphones", blurb: "Over-ear comfort, 60H playtime" },
  { id: "solar", name: "Solar Lights", blurb: "Load-shedding proof outdoor lighting" },
  { id: "cooling", name: "Mobile Cooling Fans", blurb: "CX20 series gaming coolers" },
];

export const SEED_SETTINGS: Settings = {
  theme: "theme-pk",
  brandName: "Audiony Gadgets",
  tagline: "Premium sound & smart gadgets, delivered across Pakistan",
  whatsapp: "923435295541",
  email: "support@audionygadgets.pk",
  supportPhone: "0343 5295541",
  address: "Lahore, Punjab, Pakistan",
  freeShippingOver: 5000,
  shippingFlat: 249,
  provinceRates: {
    Punjab: 199,
    Sindh: 249,
    "Khyber Pakhtunkhwa": 279,
    Balochistan: 349,
    "Islamabad Capital Territory": 199,
    "Gilgit-Baltistan": 399,
    "Azad Kashmir": 349,
  },
  saleBannerText: "AZADI FLASH SALE — up to 60% OFF + extra 30% on advance payment",
  saleEndsAt: new Date(Date.now() + 6 * 3600000).toISOString(),
  independenceBanner: true,
  liveSalesPopup: true,
  socials: {
    facebook: "https://facebook.com/audionygadgets",
    instagram: "https://instagram.com/audionygadgets",
    tiktok: "https://tiktok.com/@audionygadgets",
    youtube: "https://youtube.com/@audionygadgets",
  },
  seo: {
    title: "Audiony Gadgets — Premium Earbuds, Headphones & Gadgets in Pakistan",
    description:
      "Shop premium wireless earbuds, bluetooth headphones, solar lights and CX20 mobile cooling fans in Pakistan. Cash on delivery, 30% off on advance payment.",
  },
  analytics: { ga4: "", metaPixel: "", gtm: "", tiktokPixel: "" },
};

export const SEED_BLOG: BlogPost[] = [
  {
    id: "b1",
    slug: "best-wireless-earbuds-under-5000-in-pakistan",
    title: "Best Wireless Earbuds Under Rs 5,000 in Pakistan (2026)",
    excerpt:
      "We tested the most popular budget TWS earbuds available in Pakistan for sound, calls, latency and battery life.",
    body: "Budget earbuds in Pakistan have improved dramatically. In this guide we compare battery life, ANC, call clarity and gaming latency so you can pick the right pair under Rs 5,000. The Audiony A90 Pro leads on ANC and battery, while the A55 wins for gaming latency.",
    category: "Buying Guides",
    author: "Audiony Team",
    date: "2026-07-22",
  },
  {
    id: "b2",
    slug: "how-mobile-cooling-fans-work",
    title: "Do Mobile Cooling Fans Actually Work? CX20 Tested",
    excerpt: "We measured phone temperatures during 90fps gaming with and without the CX20 cooler.",
    body: "Semiconductor coolers move heat away from the phone's back glass faster than passive cooling. In our test the CX20 kept a flagship phone 16°C cooler across a 60 minute session, preventing frame drops.",
    category: "Reviews",
    author: "Audiony Team",
    date: "2026-07-10",
  },
  {
    id: "b3",
    slug: "solar-lights-load-shedding-guide",
    title: "Solar Lights Buying Guide for Load-Shedding",
    excerpt: "Panel size, battery chemistry and lumens explained in plain language.",
    body: "Not all solar lights survive a Pakistani summer. Look for LiFePO4 batteries, IP65 or better ratings and monocrystalline panels. We explain how to size a light for your gate, garden or shop.",
    category: "Guides",
    author: "Audiony Team",
    date: "2026-06-28",
  },
];

export const LIVE_SALES_FEED = [
  "Ali from Lahore purchased CX20 Cooling Fan",
  "Sana from Karachi purchased A90 Pro Earbuds",
  "Bilal from Faisalabad purchased H7 Max Headphones",
  "Ahmed from Islamabad purchased SolarMax 120W",
  "Hamza from Multan purchased A55 Gaming Earbuds",
  "Ayesha from Peshawar purchased CX20 Cooling Fan",
];
