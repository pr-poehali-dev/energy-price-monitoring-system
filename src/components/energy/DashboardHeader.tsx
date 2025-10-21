import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardHeader() {
  const { t, language } = useLanguage();

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Icon name="Zap" className="text-primary" size={36} />
          {t('app.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('app.subtitle')}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="px-4 py-2 text-sm font-mono">
          <Icon name="Calendar" size={16} className="mr-2" />
          {t('app.updated')}: {new Date().toLocaleDateString(language === 'en' ? 'en-GB' : 'ru-RU')}
        </Badge>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
