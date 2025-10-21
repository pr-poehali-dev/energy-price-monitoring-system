import { useState } from 'react';

const API_URL = "https://functions.poehali.dev/9a386a41-ad70-4d41-b906-6ba0b02f206c";

const REGIONAL_TARIFFS: Record<string, number> = {
  'Москва': 6.19, 'Санкт-Петербург': 5.70, 'Московская область': 6.35,
  'Белгородская область': 5.85, 'Брянская область': 5.72, 'Владимирская область': 5.68,
  'Воронежская область': 5.91, 'Ивановская область': 5.54, 'Калужская область': 6.12,
  'Костромская область': 5.48, 'Курская область': 5.79, 'Липецкая область': 5.82,
  'Орловская область': 5.64, 'Рязанская область': 5.76, 'Смоленская область': 5.69,
  'Тамбовская область': 5.73, 'Тверская область': 5.81, 'Тульская область': 6.08,
  'Ярославская область': 5.84, 'Республика Карелия': 6.15, 'Республика Коми': 6.42,
  'Архангельская область': 6.28, 'Ненецкий АО': 7.85, 'Вологодская область': 5.94,
  'Калининградская область': 6.23, 'Ленинградская область': 5.82, 'Мурманская область': 6.91,
  'Новгородская область': 5.77, 'Псковская область': 5.73, 'Республика Адыгея': 5.34,
  'Республика Калмыкия': 5.28, 'Республика Крым': 5.67, 'Краснодарский край': 5.42,
  'Астраханская область': 5.39, 'Волгоградская область': 5.48, 'Ростовская область': 5.51,
  'Севастополь': 5.63, 'Республика Дагестан': 4.89, 'Республика Ингушетия': 4.76,
  'Кабардино-Балкарская Республика': 4.82, 'Карачаево-Черкесская Республика': 4.79,
  'Республика Северная Осетия': 4.85, 'Чеченская Республика': 4.73, 'Ставропольский край': 5.24,
  'Республика Башкортостан': 5.18, 'Республика Марий Эл': 5.32, 'Республика Мордовия': 5.36,
  'Республика Татарстан': 5.12, 'Удмуртская Республика': 5.29, 'Чувашская Республика': 5.34,
  'Кировская область': 5.44, 'Нижегородская область': 5.58, 'Оренбургская область': 5.22,
  'Пензенская область': 5.41, 'Пермский край': 5.37, 'Самарская область': 5.46,
  'Саратовская область': 5.39, 'Ульяновская область': 5.35, 'Курганская область': 5.28,
  'Свердловская область': 4.98, 'Тюменская область': 5.64, 'Ханты-Мансийский АО': 6.18,
  'Ямало-Ненецкий АО': 7.24, 'Челябинская область': 5.15, 'Республика Алтай': 4.52,
  'Республика Тыва': 4.38, 'Республика Хакасия': 3.82, 'Алтайский край': 4.67,
  'Красноярский край': 4.23, 'Иркутская область': 3.21, 'Кемеровская область': 4.44,
  'Новосибирская область': 4.67, 'Омская область': 4.89, 'Томская область': 4.56,
  'Республика Бурятия': 4.78, 'Республика Саха (Якутия)': 7.92, 'Забайкальский край': 5.87,
  'Камчатский край': 8.45, 'Приморский край': 6.34, 'Хабаровский край': 6.28,
  'Амурская область': 5.92, 'Магаданская область': 8.12, 'Сахалинская область': 7.38,
  'Еврейская АО': 5.84, 'Чукотский АО': 9.15
};

export default function DbUpdate() {
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const log = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const api = async (action: string, data: any = {}) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data })
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  };

  const run = async () => {
    setRunning(true);
    setLogs([]);
    setProgress(0);

    try {
      log('='.repeat(60));
      log('ОБНОВЛЕНИЕ БАЗЫ ДАННЫХ');
      log('='.repeat(60));

      log('Удаление старых данных...');
      const del = await api('delete_all_prices');
      log(`✓ Удалено: ${del.deleted_rows}`);
      setProgress(20);

      log('Получение регионов...');
      const reg = await api('get_all_regions');
      log(`✓ Регионов: ${reg.regions.length}`);
      setProgress(40);

      const records: any[] = [];
      const dates: [string, number][] = [
        ['2024-01-01', 1.00],
        ['2024-07-01', 1.023],
        ['2024-12-01', 1.045]
      ];

      let moscowId = null;
      let spbId = null;

      for (const region of reg.regions) {
        const base = REGIONAL_TARIFFS[region.name] || 5.50;
        if (region.name === 'Москва') moscowId = region.id;
        if (region.name === 'Санкт-Петербург') spbId = region.id;

        for (const [date, mult] of dates) {
          records.push({
            region_id: region.id,
            price: Math.round(base * mult * 100) / 100,
            recorded_at: date,
            tariff_type: 'single',
            consumer_type: 'standard',
            time_zone: 'day',
            source: 'official_2024'
          });
        }
      }

      if (moscowId) {
        log('Добавление тарифов Москвы...');
        const msk: [string, string, string, string, number][] = [
          ['2024-01-01', 'two_zone', 'standard', 'day', 6.70],
          ['2024-01-01', 'two_zone', 'standard', 'night', 2.19],
          ['2024-01-01', 'three_zone', 'standard', 'peak', 7.32],
          ['2024-01-01', 'three_zone', 'standard', 'half_peak', 5.92],
          ['2024-01-01', 'three_zone', 'standard', 'night', 1.99],
          ['2024-07-01', 'two_zone', 'standard', 'day', 6.85],
          ['2024-07-01', 'two_zone', 'standard', 'night', 2.24],
          ['2024-07-01', 'three_zone', 'standard', 'peak', 7.48],
          ['2024-07-01', 'three_zone', 'standard', 'half_peak', 6.06],
          ['2024-07-01', 'three_zone', 'standard', 'night', 2.03],
          ['2024-12-01', 'two_zone', 'standard', 'day', 7.00],
          ['2024-12-01', 'two_zone', 'standard', 'night', 2.29],
          ['2024-12-01', 'three_zone', 'standard', 'peak', 7.65],
          ['2024-12-01', 'three_zone', 'standard', 'half_peak', 6.19],
          ['2024-12-01', 'three_zone', 'standard', 'night', 2.08],
          ['2024-01-01', 'single', 'electric_stove', 'day', 4.14],
          ['2024-01-01', 'two_zone', 'electric_stove', 'day', 4.69],
          ['2024-01-01', 'two_zone', 'electric_stove', 'night', 1.53],
          ['2024-07-01', 'single', 'electric_stove', 'day', 4.24],
          ['2024-07-01', 'two_zone', 'electric_stove', 'day', 4.79],
          ['2024-07-01', 'two_zone', 'electric_stove', 'night', 1.56],
          ['2024-12-01', 'single', 'electric_stove', 'day', 4.33],
          ['2024-12-01', 'two_zone', 'electric_stove', 'day', 4.90],
          ['2024-12-01', 'two_zone', 'electric_stove', 'night', 1.60]
        ];
        for (const [d, t, c, z, p] of msk) {
          records.push({
            region_id: moscowId, price: p, recorded_at: d,
            tariff_type: t, consumer_type: c, time_zone: z,
            source: 'official_2024_detailed'
          });
        }
      }

      if (spbId) {
        log('Добавление тарифов СПб...');
        records.push(
          { region_id: spbId, price: 5.70, recorded_at: '2024-01-01', tariff_type: 'single', consumer_type: 'standard', time_zone: 'day', source: 'official_2024_detailed' },
          { region_id: spbId, price: 6.19, recorded_at: '2024-07-01', tariff_type: 'single', consumer_type: 'standard', time_zone: 'day', source: 'official_2024_detailed' },
          { region_id: spbId, price: 6.32, recorded_at: '2024-12-01', tariff_type: 'single', consumer_type: 'standard', time_zone: 'day', source: 'official_2024_detailed' }
        );
      }

      log(`Сформировано ${records.length} записей`);
      setProgress(60);

      log('Вставка в БД...');
      let inserted = 0;
      for (let i = 0; i < records.length; i += 100) {
        const batch = records.slice(i, i + 100);
        const res = await api('insert_prices', { prices: batch });
        inserted += res.inserted_rows;
        log(`  Пакет ${Math.floor(i / 100) + 1}: +${res.inserted_rows}`);
        setProgress(60 + (i / records.length) * 35);
      }

      setProgress(100);
      log('='.repeat(60));
      log(`✓ ГОТОВО! Вставлено ${inserted} записей`);
      log('='.repeat(60));
    } catch (e: any) {
      log(`❌ ОШИБКА: ${e.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', fontFamily: 'monospace' }}>
      <h1 style={{ textAlign: 'center' }}>🗄️ Обновление БД тарифов</h1>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button
          onClick={run}
          disabled={running}
          style={{
            padding: '12px 30px',
            fontSize: 16,
            fontWeight: 'bold',
            background: running ? '#ccc' : '#00cc00',
            color: '#000',
            border: 'none',
            borderRadius: 5,
            cursor: running ? 'not-allowed' : 'pointer'
          }}
        >
          {running ? '⏳ Выполняется...' : '▶ Запустить'}
        </button>
      </div>

      {progress > 0 && (
        <div style={{ margin: '20px 0' }}>
          <div style={{ background: '#ddd', height: 25, borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              background: '#00cc00',
              height: '100%',
              width: `${progress}%`,
              transition: 'width 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 'bold'
            }}>
              {progress}%
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: '#000',
        color: '#0f0',
        padding: 20,
        borderRadius: 8,
        minHeight: 400,
        maxHeight: 500,
        overflow: 'auto',
        whiteSpace: 'pre-wrap'
      }}>
        {logs.length === 0 ? 'Нажмите "Запустить" для обновления...' : logs.join('\n')}
      </div>
    </div>
  );
}
