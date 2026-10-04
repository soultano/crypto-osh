import { ru } from "@/content/ru";
import { uz } from "@/content/uz";
import { en } from "@/content/en";

export const locales = ["ru", "uz", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export type Dictionary = typeof ru;

const dictionaries: Record<Locale, Dictionary> = { ru, uz, en };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

export const localeLabels: Record<Locale, string> = { ru: "RU", uz: "UZ", en: "EN" };
export const htmlLang: Record<Locale, string> = { ru: "ru", uz: "uz-Latn", en: "en" };
export const ogLocale: Record<Locale, string> = { ru: "ru_RU", uz: "uz_UZ", en: "en_US" };
