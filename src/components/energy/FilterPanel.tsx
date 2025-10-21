import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { Filters, ZoneStat } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  zoneStats: ZoneStat[];
  maxPrice: number;
  onReset: () => void;
}

export default function FilterPanel({ 
  filters, 
  onFiltersChange, 
  zoneStats,
  maxPrice,
  onReset 
}: FilterPanelProps) {
  const { t } = useLanguage();
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleZone = (zone: string) => {
    const newZones = filters.zones.includes(zone)
      ? filters.zones.filter(z => z !== zone)
      : [...filters.zones, zone];
    updateFilter('zones', newZones);
  };

  const activeFiltersCount = 
    filters.zones.length + 
    (filters.searchQuery ? 1 : 0) +
    (filters.year && filters.year !== 'all' ? 1 : 0) +
    (filters.tariffType !== 'all' ? 1 : 0) +
    (filters.tariffStructure !== 'all' ? 1 : 0) +
    (filters.timeZone && filters.timeZone !== 'all' ? 1 : 0) +
    (filters.consumerType !== 'all' ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="SlidersHorizontal" className="text-primary" size={24} />
          <h3 className="text-xl font-semibold">{t('filters.title')}</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <Icon name="X" size={16} className="mr-2" />
            {t('filters.reset')}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.search')}</label>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={t('filters.enterRegion')}
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.federalDistricts')}</label>
          <div className="flex flex-wrap gap-2">
            {zoneStats.map((zone) => (
              <Badge
                key={zone.zone}
                variant={filters.zones.includes(zone.zone) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => toggleZone(zone.zone)}
              >
                {zone.zone}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Год данных</label>
          <Select value={filters.year || 'all'} onValueChange={(value: any) => updateFilter('year', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все годы</SelectItem>
              <SelectItem value="2025">2025 год</SelectItem>
              <SelectItem value="2024">2024 год</SelectItem>
              <SelectItem value="2023">2023 год</SelectItem>
              <SelectItem value="2022">2022 год</SelectItem>
              <SelectItem value="2021">2021 год</SelectItem>
              <SelectItem value="2020">2020 год</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.changeType')}</label>
          <Select value={filters.tariffType} onValueChange={(value: any) => updateFilter('tariffType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allRegions')}</SelectItem>
              <SelectItem value="growing">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={16} className="text-destructive" />
                  {t('filters.risingTariffs')}
                </div>
              </SelectItem>
              <SelectItem value="decreasing">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingDown" size={16} className="text-secondary" />
                  {t('filters.decliningTariffs')}
                </div>
              </SelectItem>
              <SelectItem value="stable">
                <div className="flex items-center gap-2">
                  <Icon name="Minus" size={16} />
                  {t('filters.stableTariffs')}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.tariffStructure')}</label>
          <Select value={filters.tariffStructure} onValueChange={(value: any) => updateFilter('tariffStructure', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tariff.allTariffs')}</SelectItem>
              <SelectItem value="single">{t('tariff.single')}</SelectItem>
              <SelectItem value="two_zone">{t('tariff.twoZone')} ({t('tariff.day')}/{t('tariff.night')})</SelectItem>
              <SelectItem value="three_zone">{t('tariff.threeZone')} ({t('tariff.peak')}/{t('tariff.halfPeak')}/{t('tariff.night')})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(filters.tariffStructure === 'two_zone' || filters.tariffStructure === 'three_zone') && (
          <div>
            <label className="text-sm font-medium mb-2 block">{t('filters.timeZone')}</label>
            <Select value={filters.timeZone || 'all'} onValueChange={(value: any) => updateFilter('timeZone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('timeZone.all')}</SelectItem>
                {filters.tariffStructure === 'two_zone' && (
                  <>
                    <SelectItem value="day">{t('tariff.day')}</SelectItem>
                    <SelectItem value="night">{t('tariff.night')}</SelectItem>
                  </>
                )}
                {filters.tariffStructure === 'three_zone' && (
                  <>
                    <SelectItem value="peak">{t('tariff.peak')}</SelectItem>
                    <SelectItem value="half_peak">{t('tariff.halfPeak')}</SelectItem>
                    <SelectItem value="night">{t('tariff.night')}</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">{t('filters.consumerType')}</label>
          <Select value={filters.consumerType} onValueChange={(value: any) => updateFilter('consumerType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allConsumers')}</SelectItem>
              <SelectItem value="standard">{t('tariff.standard')}</SelectItem>
              <SelectItem value="electric_stove">{t('tariff.withStove')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{t('filters.priceRange')}</label>
            <span className="text-sm text-muted-foreground font-mono">
              {filters.priceRange[0].toFixed(2)} - {filters.priceRange[1].toFixed(2)} ₽
            </span>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
            min={0}
            max={maxPrice}
            step={0.1}
            className="mt-2"
          />
        </div>
      </div>
    </Card>
  );
}