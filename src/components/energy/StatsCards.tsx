import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Region } from './types';

interface StatsCardsProps {
  regions: Region[];
}

export default function StatsCards({ regions }: StatsCardsProps) {
  const { t } = useLanguage();
  const avgPrice = regions.length > 0 
    ? (regions.reduce((sum, r) => sum + r.current_price, 0) / regions.length).toFixed(2)
    : '0.00';
  
  const maxPriceRegion = regions.reduce((max, r) => r.current_price > max.current_price ? r : max, regions[0] || { current_price: 0, name: '-' });
  const minPriceRegion = regions.reduce((min, r) => r.current_price < min.current_price ? r : min, regions[0] || { current_price: 0, name: '-' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-scale-in">
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('stats.avgPrice')}</p>
            <p className="text-3xl font-bold font-mono mt-1">{avgPrice} ₽</p>
            <p className="text-xs text-muted-foreground mt-1">{t('stats.perKwh')}</p>
          </div>
          <Icon name="TrendingUp" className="text-secondary" size={32} />
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-secondary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('stats.maxPrice')}</p>
            <p className="text-3xl font-bold font-mono mt-1">{maxPriceRegion.current_price.toFixed(2)} ₽</p>
            <p className="text-xs text-muted-foreground mt-1">{maxPriceRegion.name}</p>
          </div>
          <Icon name="ArrowUpCircle" className="text-destructive" size={32} />
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-chart-2/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('stats.minPrice')}</p>
            <p className="text-3xl font-bold font-mono mt-1">{minPriceRegion.current_price.toFixed(2)} ₽</p>
            <p className="text-xs text-muted-foreground mt-1">{minPriceRegion.name}</p>
          </div>
          <Icon name="ArrowDownCircle" className="text-secondary" size={32} />
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-chart-4/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('stats.regions')}</p>
            <p className="text-3xl font-bold font-mono mt-1">{regions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('stats.tracked')}</p>
          </div>
          <Icon name="MapPin" className="text-chart-4" size={32} />
        </div>
      </Card>
    </div>
  );
}