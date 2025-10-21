import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import type { Region } from './types';
import { useState } from 'react';

interface RegionsTabProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
}

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'change-asc' | 'change-desc';

export default function RegionsTab({ regions, selectedRegion, onSelectRegion }: RegionsTabProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedRegions = [...regions]
    .filter(region => 
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.zone.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name, 'ru');
      case 'price-asc':
        return a.current_price - b.current_price;
      case 'price-desc':
        return b.current_price - a.current_price;
      case 'change-asc':
        return a.change - b.change;
      case 'change-desc':
        return b.change - a.change;
      default:
        return 0;
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Все регионы</h3>
          <Badge variant="outline">
            {filteredAndSortedRegions.length} из {regions.length}
          </Badge>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск региона..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-muted-foreground">Сортировка:</span>
          <Button 
            size="sm" 
            variant={sortBy === 'name' ? 'default' : 'outline'}
            onClick={() => setSortBy('name')}
          >
            <Icon name="SortAsc" size={14} className="mr-1" />
            По названию
          </Button>
          <Button 
            size="sm" 
            variant={sortBy === 'price-asc' ? 'default' : 'outline'}
            onClick={() => setSortBy('price-asc')}
          >
            <Icon name="ArrowUp" size={14} className="mr-1" />
            Дешевле
          </Button>
          <Button 
            size="sm" 
            variant={sortBy === 'price-desc' ? 'default' : 'outline'}
            onClick={() => setSortBy('price-desc')}
          >
            <Icon name="ArrowDown" size={14} className="mr-1" />
            Дороже
          </Button>
          <Button 
            size="sm" 
            variant={sortBy === 'change-desc' ? 'default' : 'outline'}
            onClick={() => setSortBy('change-desc')}
          >
            <Icon name="TrendingUp" size={14} className="mr-1" />
            Рост
          </Button>
          <Button 
            size="sm" 
            variant={sortBy === 'change-asc' ? 'default' : 'outline'}
            onClick={() => setSortBy('change-asc')}
          >
            <Icon name="TrendingDown" size={14} className="mr-1" />
            Снижение
          </Button>
        </div>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {filteredAndSortedRegions.length > 0 ? (
            filteredAndSortedRegions.map((region) => (
            <div
              key={region.id}
              onClick={() => onSelectRegion(region)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRegion.id === region.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" className={selectedRegion.id === region.id ? 'text-primary' : 'text-muted-foreground'} size={18} />
                  <div>
                    <p className="font-medium">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.zone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-mono font-bold">{region.current_price.toFixed(2)} ₽</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Icon 
                      name={region.change > 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      className={region.change > 0 ? 'text-destructive' : 'text-secondary'}
                    />
                    <span className={`text-xs font-medium ${region.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                      {Math.abs(region.change)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Регионы не найдены</p>
              <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить запрос</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Info" className="text-primary" size={24} />
          <h3 className="text-xl font-semibold">Детали региона</h3>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-2xl font-bold mb-1">{selectedRegion.name}</p>
            <Badge variant="outline">{selectedRegion.zone}</Badge>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Текущая цена</p>
              <p className="text-4xl font-mono font-bold">{selectedRegion.current_price.toFixed(2)} ₽</p>
              <p className="text-sm text-muted-foreground mt-1">за кВт⋅ч</p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Изменение</p>
                <Icon 
                  name={selectedRegion.change > 0 ? "TrendingUp" : "TrendingDown"} 
                  className={selectedRegion.change > 0 ? 'text-destructive' : 'text-secondary'}
                  size={18}
                />
              </div>
              <p className={`text-2xl font-bold ${selectedRegion.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                {selectedRegion.change > 0 ? '+' : ''}{selectedRegion.change}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">за последний месяц</p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Население</p>
              </div>
              <p className="text-xl font-semibold">{selectedRegion.population} млн</p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Zap" size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Ежемесячный расход</p>
              </div>
              <p className="text-xl font-semibold">{(selectedRegion.population * 450).toFixed(0)} МВт⋅ч</p>
              <p className="text-xs text-muted-foreground mt-1">ориентировочно</p>
            </div>

            {selectedRegion.cities && selectedRegion.cities.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Building2" size={18} className="text-primary" />
                  <p className="text-sm font-semibold">Крупные города</p>
                </div>
                <div className="space-y-2">
                  {selectedRegion.cities.map((city, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div>
                        <p className="text-sm font-medium">{city.name}</p>
                        <p className="text-xs text-muted-foreground">{city.population} млн чел.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-mono font-bold">{city.price.toFixed(2)} ₽</p>
                        <p className="text-xs text-muted-foreground">за кВт⋅ч</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}