import type { Language } from '@/contexts/LanguageContext';

export function translateRegionName(name: string, language: Language, t: (key: string) => string): string {
  if (language === 'ru') return name;
  return t(`region.${name}`) || name;
}

export function translateZoneName(name: string, language: Language, t: (key: string) => string): string {
  if (language === 'ru') return name;
  return t(`zone.${name}`) || name;
}
