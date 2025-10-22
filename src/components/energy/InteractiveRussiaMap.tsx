import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Region } from './types';
import 'leaflet/dist/leaflet.css';

interface InteractiveRussiaMapProps {
  regions: Region[];
  onSelectRegion: (region: Region) => void;
}

const regionCoordinates: Record<string, [number, number]> = {
  'Москва': [55.7558, 37.6173],
  'Санкт-Петербург': [59.9343, 30.3351],
  'Московская область': [55.5, 37.5],
  'Ленинградская область': [60.0, 31.0],
  'Калининградская область': [54.7104, 20.4522],
  'Мурманская область': [68.9585, 33.0827],
  'Архангельская область': [64.5401, 40.5433],
  'Вологодская область': [59.2239, 39.8840],
  'Новгородская область': [58.5220, 31.2675],
  'Псковская область': [57.8136, 28.3496],
  'Республика Карелия': [61.7849, 34.3469],
  'Республика Коми': [64.0, 54.0],
  'Ненецкий автономный округ': [67.6385, 53.0065],
  'Тверская область': [57.0, 35.0],
  'Ярославская область': [57.6261, 39.8845],
  'Костромская область': [58.0, 42.0],
  'Ивановская область': [57.0, 41.0],
  'Владимирская область': [56.1366, 40.3966],
  'Рязанская область': [54.6269, 39.6916],
  'Тульская область': [54.1961, 37.6182],
  'Калужская область': [54.5293, 36.2754],
  'Смоленская область': [54.7818, 32.0401],
  'Брянская область': [53.2521, 34.3717],
  'Орловская область': [52.9651, 36.0785],
  'Курская область': [51.7373, 36.1873],
  'Белгородская область': [50.5953, 36.5861],
  'Воронежская область': [51.6720, 39.2100],
  'Липецкая область': [52.6103, 39.5698],
  'Тамбовская область': [52.7213, 41.4522],
  'Пензенская область': [53.2007, 45.0046],
  'Ульяновская область': [54.3143, 48.4033],
  'Самарская область': [53.2028, 50.1408],
  'Саратовская область': [51.5339, 46.0344],
  'Волгоградская область': [48.7194, 44.5018],
  'Астраханская область': [46.3497, 48.0408],
  'Республика Татарстан': [55.7887, 49.1221],
  'Удмуртская Республика': [57.0, 53.0],
  'Республика Башкортостан': [54.7388, 55.9721],
  'Оренбургская область': [51.7727, 55.0988],
  'Кировская область': [58.6035, 49.6679],
  'Нижегородская область': [56.3269, 44.0059],
  'Республика Марий Эл': [56.6341, 47.8906],
  'Чувашская Республика': [56.1439, 47.2489],
  'Республика Мордовия': [54.1838, 45.1749],
  'Пермский край': [58.0105, 56.2502],
  'Свердловская область': [56.8519, 60.6122],
  'Челябинская область': [55.1644, 61.4368],
  'Курганская область': [55.4500, 65.3333],
  'Тюменская область': [57.1522, 65.5272],
  'Ханты-Мансийский автономный округ': [61.0042, 69.0019],
  'Ямало-Ненецкий автономный округ': [66.5333, 66.6167],
  'Республика Алтай': [51.9581, 85.9603],
  'Алтайский край': [53.3481, 83.7799],
  'Кемеровская область': [54.5293, 86.0878],
  'Новосибирская область': [55.0084, 82.9357],
  'Омская область': [54.9885, 73.3242],
  'Томская область': [56.4977, 84.9744],
  'Красноярский край': [56.0, 93.0],
  'Иркутская область': [52.2869, 104.3050],
  'Республика Бурятия': [51.8272, 107.6063],
  'Республика Тыва': [51.7191, 94.4529],
  'Республика Хакасия': [53.7157, 91.4292],
  'Забайкальский край': [52.0, 116.0],
  'Республика Саха (Якутия)': [62.0, 129.7],
  'Амурская область': [52.0, 127.5],
  'Хабаровский край': [48.4827, 135.0838],
  'Приморский край': [43.1332, 131.9113],
  'Сахалинская область': [46.9589, 142.7386],
  'Еврейская автономная область': [48.0, 132.0],
  'Магаданская область': [59.5636, 150.8027],
  'Камчатский край': [53.0167, 158.65],
  'Чукотский автономный округ': [66.0, 171.0],
  'Ростовская область': [47.2357, 39.7015],
  'Краснодарский край': [45.0355, 38.9753],
  'Ставропольский край': [45.0428, 41.9692],
  'Республика Адыгея': [44.6098, 40.1006],
  'Республика Калмыкия': [46.3078, 44.2506],
  'Карачаево-Черкесская Республика': [43.7668, 41.9270],
  'Кабардино-Балкарская Республика': [43.4981, 43.6189],
  'Республика Северная Осетия': [43.0181, 44.6820],
  'Республика Ингушетия': [43.1653, 45.0000],
  'Чеченская Республика': [43.4058, 45.6986],
  'Республика Дагестан': [42.9849, 47.5047],
};

export default function InteractiveRussiaMap({ regions, onSelectRegion }: InteractiveRussiaMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const getColorByPrice = (price: number) => {
    if (price < 4) return '#10b981';
    if (price < 4.5) return '#84cc16';
    if (price < 5) return '#eab308';
    if (price < 5.5) return '#f97316';
    return '#ef4444';
  };

  const getRadiusByPrice = (price: number) => {
    const minPrice = Math.min(...regions.map(r => r.current_price));
    const maxPrice = Math.max(...regions.map(r => r.current_price));
    const normalized = (price - minPrice) / (maxPrice - minPrice);
    return 5 + normalized * 15;
  };

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region);
    onSelectRegion(region);
  };

  const minPrice = Math.min(...regions.map(r => r.current_price));
  const maxPrice = Math.max(...regions.map(r => r.current_price));

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Интерактивная карта России</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Масштабируйте, перемещайте и кликайте по регионам
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Диапазон цен (₽/кВт⋅ч)</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono">{minPrice.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">—</span>
              <span className="text-xs font-mono">{maxPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="h-3 rounded-full flex overflow-hidden">
            <div className="flex-1" style={{ background: 'linear-gradient(to right, #10b981, #84cc16, #eab308, #f97316, #ef4444)' }}></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Низкие тарифы</span>
            <span>Средние</span>
            <span>Высокие тарифы</span>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border" style={{ height: '600px' }}>
          <MapContainer
            center={[64.0, 100.0]}
            zoom={3}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />

            {regions.map((region) => {
              const coords = regionCoordinates[region.name];
              if (!coords) return null;

              return (
                <CircleMarker
                  key={region.id}
                  center={coords}
                  radius={getRadiusByPrice(region.current_price)}
                  pathOptions={{
                    fillColor: getColorByPrice(region.current_price),
                    fillOpacity: 0.7,
                    color: '#ffffff',
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => handleRegionClick(region),
                  }}
                >
                  <Popup>
                    <div className="space-y-2 min-w-[200px]">
                      <div>
                        <p className="font-semibold text-sm">{region.name}</p>
                        <p className="text-xs text-muted-foreground">{region.zone}</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{region.current_price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">₽/кВт⋅ч</span>
                      </div>
                      <Badge variant={region.change > 0 ? 'destructive' : 'secondary'} className="text-xs">
                        {region.change > 0 ? '↑' : '↓'} {Math.abs(region.change).toFixed(2)}%
                      </Badge>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-muted-foreground">{'< 4.0 ₽'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#84cc16]"></div>
            <span className="text-muted-foreground">4.0 - 4.5 ₽</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
            <span className="text-muted-foreground">4.5 - 5.0 ₽</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
            <span className="text-muted-foreground">5.0 - 5.5 ₽</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          💡 Подсказка: используйте колесо мыши для масштабирования • Кликните по региону для деталей
        </div>
      </div>
    </Card>
  );
}