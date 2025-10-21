import { ru } from './ru';
import { en } from './en';

export type Language = 'ru' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  ru,
  en,
};
