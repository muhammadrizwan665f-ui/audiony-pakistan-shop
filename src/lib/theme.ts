import type { ThemeId } from "./types";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  swatch: string[];
}

export const THEME_CLASSES: ThemeId[] = [
  "theme-pk",
  "theme-gold",
  "theme-cyan",
  "theme-orange",
  "theme-red",
  "theme-violet",
];

export const THEMES: ThemeOption[] = [
  {
    id: "theme-pk",
    name: "Pakistan Independence",
    description: "Crisp white with national green — festive and trustworthy.",
    swatch: ["#0f5132", "#3fae6f", "#ffffff"],
  },
  {
    id: "theme-gold",
    name: "Royal Black + Gold",
    description: "Luxury dark theme with champagne gold accents.",
    swatch: ["#141210", "#c9a227", "#f2e6c9"],
  },
  {
    id: "theme-cyan",
    name: "Dark Blue + Cyan",
    description: "Tech-forward navy with electric cyan highlights.",
    swatch: ["#0b1a2b", "#22d3ee", "#e6f6fb"],
  },
  {
    id: "theme-orange",
    name: "White + Orange",
    description: "Bright retail look with high-energy orange CTAs.",
    swatch: ["#ffffff", "#f97316", "#1f2937"],
  },
  {
    id: "theme-red",
    name: "Black + Red Gaming",
    description: "Aggressive gaming aesthetic with neon red edges.",
    swatch: ["#111010", "#ef4444", "#f5f5f5"],
  },
  {
    id: "theme-violet",
    name: "Midnight Violet",
    description: "Premium midnight purple with soft violet glow.",
    swatch: ["#141026", "#8b5cf6", "#ede9fe"],
  },
];
