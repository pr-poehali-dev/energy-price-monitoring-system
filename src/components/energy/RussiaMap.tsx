import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Region } from './types';

interface RussiaMapProps {
  regions: Region[];
  onSelectRegion: (region: Region) => void;
}

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/russia/russia-regions.json';

const regionNameMapping: Record<string, string> = {
  'Республика Адыгея': 'Adygeya',
  'Республика Алтай': 'Altay',
  'Алтайский край': 'Altay Kray',
  'Амурская область': 'Amur',
  'Архангельская область': 'Arkhangel\'sk',
  'Астраханская область': 'Astrakhan\'',
  'Республика Башкортостан': 'Bashkortostan',
  'Белгородская область': 'Belgorod',
  'Брянская область': 'Bryansk',
  'Республика Бурятия': 'Buryatiya',
  'Чеченская Республика': 'Chechnya',
  'Челябинская область': 'Chelyabinsk',
  'Чукотский автономный округ': 'Chukotka',
  'Чувашская Республика': 'Chuvashiya',
  'Республика Дагестан': 'Dagestan',
  'Республика Ингушетия': 'Ingushetiya',
  'Иркутская область': 'Irkutsk',
  'Ивановская область': 'Ivanovo',
  'Еврейская автономная область': 'Jewish',
  'Кабардино-Балкарская Республика': 'Kabardino-Balkariya',
  'Калининградская область': 'Kaliningrad',
  'Республика Калмыкия': 'Kalmykiya',
  'Калужская область': 'Kaluga',
  'Камчатский край': 'Kamchatka',
  'Карачаево-Черкесская Республика': 'Karachayevo-Cherkesiya',
  'Республика Карелия': 'Karelia',
  'Кемеровская область': 'Kemerovo',
  'Хабаровский край': 'Khabarovsk',
  'Республика Хакасия': 'Khakasiya',
  'Ханты-Мансийский автономный округ': 'Khanty-Mansiysk',
  'Кировская область': 'Kirov',
  'Республика Коми': 'Komi',
  'Костромская область': 'Kostroma',
  'Краснодарский край': 'Krasnodar',
  'Красноярский край': 'Krasnoyarsk',
  'Курганская область': 'Kurgan',
  'Курская область': 'Kursk',
  'Ленинградская область': 'Leningrad',
  'Липецкая область': 'Lipetsk',
  'Магаданская область': 'Maga Buryatdan',
  'Республика Марий Эл': 'Mariy-El',
  'Республика Мордовия': 'Mordoviya',
  'Москва': 'Moscow',
  'Московская область': 'Moskva',
  'Мурманская область': 'Murmansk',
  'Ненецкий автономный округ': 'Nenets',
  'Нижегородская область': 'Nizhniy Novgorod',
  'Республика Северная Осетия': 'North Ossetia',
  'Новгородская область': 'Novgorod',
  'Новосибирская область': 'Novosibirsk',
  'Омская область': 'Omsk',
  'Оренбургская область': 'Orenburg',
  'Орловская область': 'Orel',
  'Пензенская область': 'Penza',
  'Пермский край': 'Perm\'',
  'Приморский край': 'Primor\'ye',
  'Псковская область': 'Pskov',
  'Ростовская область': 'Rostov',
  'Рязанская область': 'Ryazan\'',
  'Санкт-Петербург': 'Saint Petersburg',
  'Сахалинская область': 'Sakhalin',
  'Самарская область': 'Samara',
  'Саратовская область': 'Saratov',
  'Республика Саха (Якутия)': 'Sakha',
  'Смоленская область': 'Smolensk',
  'Ставропольский край': 'Stavropol\'',
  'Свердловская область': 'Sverdlovsk',
  'Тамбовская область': 'Tambov',
  'Республика Татарстан': 'Tatarstan',
  'Томская область': 'Tomsk',
  'Тульская область': 'Tula',
  'Тверская область': 'Tver\'',
  'Тюменская область': 'Tyumen\'',
  'Республика Тыва': 'Tyva',
  'Удмуртская Республика': 'Udmurtiya',
  'Ульяновская область': 'Ul\'yanovsk',
  'Владимирская область': 'Vladimir',
  'Волгоградская область': 'Volgograd',
  'Вологодская область': 'Vologda',
  'Воронежская область': 'Voronezh',
  'Ямало-Ненецкий автономный округ': 'Yamalo-Nenets',
  'Ярославская область': 'Yaroslavl\'',
  'Забайкальский край': 'Zabaykal\'sk',
};

export default function RussiaMap({ regions, onSelectRegion }: RussiaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getColorByPrice = (price: number) => {
    if (price < 4) return '#10b981';
    if (price < 4.5) return '#84cc16';
    if (price < 5) return '#eab308';
    if (price < 5.5) return '#f97316';
    return '#ef4444';
  };

  const findRegionByGeoName = (geoName: string): Region | undefined => {
    const reversedMapping = Object.entries(regionNameMapping).find(
      ([, mapName]) => mapName === geoName
    );
    
    if (reversedMapping) {
      return regions.find(r => r.name === reversedMapping[0]);
    }
    
    return regions.find(r => 
      r.name.toLowerCase().includes(geoName.toLowerCase()) ||
      geoName.toLowerCase().includes(r.name.toLowerCase())
    );
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const minPrice = Math.min(...regions.map(r => r.current_price));
  const maxPrice = Math.max(...regions.map(r => r.current_price));

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Карта России</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Интерактивная визуализация тарифов по регионам
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
            <span>Высокие тарифы</span>
          </div>
        </div>

        <div className="relative bg-muted/20 rounded-lg overflow-hidden" onMouseMove={handleMouseMove}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 200,
              center: [95, 63]
            }}
            className="w-full h-[600px]"
          >
            <ZoomableGroup center={[95, 63]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const geoName = geo.properties.name;
                    const region = findRegionByGeoName(geoName);
                    const fillColor = region 
                      ? getColorByPrice(region.current_price)
                      : '#d1d5db';

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { 
                            fill: region ? '#3b82f6' : '#9ca3af',
                            outline: 'none',
                            cursor: region ? 'pointer' : 'default'
                          },
                          pressed: { outline: 'none' }
                        }}
                        onMouseEnter={() => {
                          if (region) setHoveredRegion(region);
                        }}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => {
                          if (region) onSelectRegion(region);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {hoveredRegion && (
            <div
              className="fixed z-50 pointer-events-none bg-popover text-popover-foreground border rounded-lg shadow-lg p-3"
              style={{
                left: `${tooltipPosition.x + 15}px`,
                top: `${tooltipPosition.y + 15}px`,
                maxWidth: '250px'
              }}
            >
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-sm">{hoveredRegion.name}</p>
                  <p className="text-xs text-muted-foreground">{hoveredRegion.zone}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{hoveredRegion.current_price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">₽/кВт⋅ч</span>
                </div>
                <Badge variant={hoveredRegion.change > 0 ? 'destructive' : 'secondary'}>
                  {hoveredRegion.change > 0 ? '↑' : '↓'} {Math.abs(hoveredRegion.change).toFixed(2)}%
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Наведите курсор на регион для просмотра деталей • Кликните для подробной информации
        </div>
      </div>
    </Card>
  );
}
