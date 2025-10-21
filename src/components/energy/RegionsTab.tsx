import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { Region } from './types';

interface RegionsTabProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
}

export default function RegionsTab({ regions, selectedRegion, onSelectRegion }: RegionsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Все регионы</h3>
          <Badge variant="outline">{regions.length} регионов</Badge>
        </div>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {regions.map((region) => (
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
          ))}
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
          </div>
        </div>
      </Card>
    </div>
  );
}
