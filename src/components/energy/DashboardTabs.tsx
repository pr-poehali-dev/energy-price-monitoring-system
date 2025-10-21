import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardTabs() {
  const { t } = useLanguage();

  return (
    <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-7 md:inline-flex gap-1">
      <TabsTrigger value="overview" className="gap-2">
        <Icon name="LayoutDashboard" size={16} />
        <span className="hidden md:inline">{t('tabs.overview')}</span>
      </TabsTrigger>
      <TabsTrigger value="forecast" className="gap-2">
        <Icon name="TrendingUp" size={16} />
        <span className="hidden md:inline">{t('tabs.forecast')}</span>
      </TabsTrigger>
      <TabsTrigger value="map" className="gap-2">
        <Icon name="MapPinned" size={16} />
        <span className="hidden md:inline">{t('tabs.map')}</span>
      </TabsTrigger>
      <TabsTrigger value="regions" className="gap-2">
        <Icon name="Map" size={16} />
        <span className="hidden md:inline">{t('tabs.regions')}</span>
      </TabsTrigger>
      <TabsTrigger value="analytics" className="gap-2">
        <Icon name="LineChart" size={16} />
        <span className="hidden md:inline">{t('tabs.analytics')}</span>
      </TabsTrigger>
      <TabsTrigger value="compare" className="gap-2">
        <Icon name="BarChart3" size={16} />
        <span className="hidden md:inline">{t('tabs.compare')}</span>
      </TabsTrigger>
      <TabsTrigger value="filters" className="gap-2">
        <Icon name="SlidersHorizontal" size={16} />
        <span className="hidden md:inline">{t('tabs.filters')}</span>
      </TabsTrigger>
    </TabsList>
  );
}
