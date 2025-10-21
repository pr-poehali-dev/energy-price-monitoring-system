import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CronSetupDialog from '@/components/CronSetupDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader() {
  const { t, language } = useLanguage();
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('https://functions.poehali.dev/1d38596d-371d-453b-91cd-80200e4d0a2b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(t('sync.updated').replace('{0}', result.updated).replace('{1}', result.parsed));
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(t('sync.error'));
      }
    } catch (error) {
      toast.error(t('sync.failed'));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Icon name="Zap" className="text-primary" size={36} />
          {t('app.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('app.subtitle')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Button 
          onClick={() => navigate('/sync-logs')}
          variant="ghost"
          size="sm"
        >
          <Icon name="Activity" size={16} className="mr-2" />
          {t('logs.title')}
        </Button>
        <CronSetupDialog />
        <Button 
          onClick={handleSync}
          disabled={syncing}
          variant="outline"
          size="sm"
        >
          <Icon name={syncing ? "Loader2" : "RefreshCw"} size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? t('sync.syncing') : t('sync.updateTariffs')}
        </Button>
        <Badge variant="outline" className="px-4 py-2 text-sm font-mono">
          <Icon name="Calendar" size={16} className="mr-2" />
          {t('app.updated')}: {new Date().toLocaleDateString(language === 'en' ? 'en-GB' : 'ru-RU')}
        </Badge>
        <LanguageSwitcher />
      </div>
    </header>
  );
}