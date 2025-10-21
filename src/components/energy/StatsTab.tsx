import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  total_regions: number;
  total_records: number;
  real_data_records: number;
  first_record_date: string;
  last_record_date: string;
  total_sources: number;
  total_zones: number;
}

interface Source {
  source: string;
  count: number;
}

interface Zone {
  zone: string;
  region_count: number;
}

interface StatsResponse {
  stats: Stats;
  sources: Source[];
  zones: Zone[];
}

export default function StatsTab() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/b706b537-d317-4eec-9931-6097fd590569');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего регионов</CardTitle>
            <Icon name="MapPin" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.total_regions}</div>
            <p className="text-xs text-muted-foreground">
              {data.stats.total_zones} федеральных округов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
            <Icon name="Database" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.total_records.toLocaleString('ru-RU')}</div>
            <p className="text-xs text-muted-foreground">
              {data.stats.real_data_records.toLocaleString('ru-RU')} реальных данных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Источников данных</CardTitle>
            <Icon name="FileText" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.total_sources}</div>
            <p className="text-xs text-muted-foreground">
              Официальные и проверенные
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Период данных</CardTitle>
            <Icon name="Calendar" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {formatDate(data.stats.first_record_date)}
            </div>
            <p className="text-xs text-muted-foreground">
              до {formatDate(data.stats.last_record_date)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Распределение по источникам</CardTitle>
            <CardDescription>Количество записей по каждому источнику данных</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {source.count.toLocaleString('ru-RU')} записей
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение по округам</CardTitle>
            <CardDescription>Количество регионов в каждом федеральном округе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.zones.map((zone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{zone.zone}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {zone.region_count} регионов
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>О системе</CardTitle>
          <CardDescription>Информация о мониторинге тарифов на электроэнергию</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Система автоматически собирает и анализирует данные о тарифах на электроэнергию 
            для населения по всем регионам России. Данные обновляются ежедневно из официальных 
            источников и проверенных региональных порталов.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="CheckCircle2" size={16} className="text-green-500" />
              <span>Актуальные данные</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="CheckCircle2" size={16} className="text-green-500" />
              <span>Официальные источники</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="CheckCircle2" size={16} className="text-green-500" />
              <span>Автоматическое обновление</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
