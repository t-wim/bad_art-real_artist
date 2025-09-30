export const defaultLocale = "en";
export const supportedLocales = ["en"] as const;

export type Locale = (typeof supportedLocales)[number];

export const isSupportedLocale = (value: string | null | undefined): value is Locale =>
  value != null && supportedLocales.includes(value as Locale);
