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
    (filters.tariffType !== 'all' ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="SlidersHorizontal" className="text-primary" size={24} />
          <h3 className="text-xl font-semibold">Фильтры</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <Icon name="X" size={16} className="mr-2" />
            Сбросить
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Поиск по названию</label>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Введите название региона..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Федеральные округа</label>
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
          <label className="text-sm font-medium mb-2 block">Период анализа</label>
          <Select value={filters.period} onValueChange={(value: any) => updateFilter('period', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 дней</SelectItem>
              <SelectItem value="90">90 дней</SelectItem>
              <SelectItem value="180">180 дней</SelectItem>
              <SelectItem value="365">1 год</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Тип изменения тарифа</label>
          <Select value={filters.tariffType} onValueChange={(value: any) => updateFilter('tariffType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все регионы</SelectItem>
              <SelectItem value="growing">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={16} className="text-destructive" />
                  Растущие тарифы
                </div>
              </SelectItem>
              <SelectItem value="decreasing">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingDown" size={16} className="text-secondary" />
                  Снижающиеся тарифы
                </div>
              </SelectItem>
              <SelectItem value="stable">
                <div className="flex items-center gap-2">
                  <Icon name="Minus" size={16} />
                  Стабильные тарифы
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Диапазон цен</label>
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
