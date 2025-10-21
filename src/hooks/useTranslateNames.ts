import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslateNames() {
  const { language, t } = useLanguage();

  const translateRegionName = (name: string): string => {
    if (language === 'ru') return name;
    const key = `region.${name}`;
    const translated = t(key);
    return translated === key ? name : translated;
  };

  const translateZoneName = (name: string): string => {
    if (language === 'ru') return name;
    const key = `zone.${name}`;
    const translated = t(key);
    return translated === key ? name : translated;
  };

  return { translateRegionName, translateZoneName };
}
