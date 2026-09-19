// Local settings persistence (localStorage) — no accounts, no server.

export type ParticleDensity = "low" | "medium" | "high" | "insane";

export const PARTICLE_DENSITY_COUNTS: Record<ParticleDensity, number> = {
  low: 400,
  medium: 1000,
  high: 1700,
  insane: 2300,
};

export interface AppSettings {
  themeId: string;
  particleDensity: ParticleDensity;
  randomizeBackground: boolean;
  reduceEffects: boolean;
  rememberLastScreen: boolean;
  soundEffects: boolean;
  decimalPrecision: number;
  lastScreen: string;
  angleMode: "deg" | "rad";
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeId: "cyberpunk-mixed",
  particleDensity: "insane",
  randomizeBackground: true,
  reduceEffects: false,
  rememberLastScreen: true,
  soundEffects: false,
  decimalPrecision: 2,
  lastScreen: "calculator",
  angleMode: "deg",
};

const STORAGE_KEY = "cyberpunk-calc-settings-v1";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable (private browsing, quota) — fail silently.
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}
