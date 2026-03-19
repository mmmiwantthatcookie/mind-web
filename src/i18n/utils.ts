import { ui, type Locale, type UIKey } from './ui';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'es'];

/**
 * Get a translated UI string for the given locale and key.
 */
export function t(locale: Locale, key: UIKey): string {
  return ui[locale]?.[key] ?? ui[defaultLocale][key] ?? key;
}

/**
 * Detect the current locale from a URL pathname.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  if (locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return defaultLocale;
}

/**
 * Get the path prefix for a locale (empty for default).
 */
export function getLocalePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/**
 * Get the equivalent path in another locale.
 */
export function getAlternatePath(pathname: string, currentLocale: Locale): string {
  const targetLocale = currentLocale === 'en' ? 'es' : 'en';
  const pathWithoutLocale = currentLocale === defaultLocale
    ? pathname
    : pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/';
  
  if (targetLocale === defaultLocale) {
    return pathWithoutLocale;
  }
  return `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
}
