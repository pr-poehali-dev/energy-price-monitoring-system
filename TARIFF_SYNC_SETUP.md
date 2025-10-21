# Автоматическая синхронизация тарифов

## Описание
Система автоматически обновляет тарифы на электроэнергию из официальных источников раз в сутки.

## Backend функции

### 1. parse-tariffs
**URL:** `https://functions.poehali.dev/7eb79ab5-35a7-430b-b9fe-b2a4afe7f444`

Парсит официальные тарифы из государственных источников:
- ФАС (Федеральная антимонопольная служба)
- Россети
- Официальные публикации регионов

Возвращает данные о тарифах 2025 года для 20+ регионов.

### 2. update-tariffs
**URL:** `https://functions.poehali.dev/fe51c49b-30dd-46b7-81d5-d9b139d4b9e2`

Загружает спарсенные тарифы в базу данных PostgreSQL.
Обновляет таблицу `price_history` с реальными ценами.

### 3. sync-official-tariffs
**URL:** `https://functions.poehali.dev/1d38596d-371d-453b-91cd-80200e4d0a2b`

Оркестратор: вызывает parse-tariffs → update-tariffs последовательно.
Один POST-запрос = полная синхронизация.

### 4. daily-tariff-sync
**URL:** `https://functions.poehali.dev/2059700b-27e4-44a2-b539-769b7cec23a0`

Обёртка для cron-задачи. Вызывает sync-official-tariffs автоматически.

## Настройка автоматической синхронизации

### Вариант 1: Внешний cron-сервис (рекомендуется)

Используйте любой бесплатный cron-сервис:

#### cron-job.org
1. Зарегистрируйтесь на https://cron-job.org
2. Создайте новую задачу
3. URL: `https://functions.poehali.dev/2059700b-27e4-44a2-b539-769b7cec23a0`
4. Метод: POST
5. Расписание: `0 3 * * *` (каждый день в 3:00 UTC)
6. Сохраните

#### EasyCron.com
1. Зарегистрируйтесь на https://www.easycron.com
2. Create Cron Job
3. URL: `https://functions.poehali.dev/2059700b-27e4-44a2-b539-769b7cec23a0`
4. Cron Expression: `0 3 * * *`
5. HTTP Method: POST
6. Create

#### UptimeRobot (альтернатива)
1. Зарегистрируйтесь на https://uptimerobot.com
2. Add New Monitor
3. Monitor Type: HTTP(s)
4. URL: `https://functions.poehali.dev/2059700b-27e4-44a2-b539-769b7cec23a0`
5. Monitoring Interval: каждые 24 часа

### Вариант 2: Yandex Cloud Trigger (для продакшена)

Если функции развёрнуты в Yandex Cloud:

```bash
yc serverless trigger create timer \
  --name daily-tariff-sync \
  --cron-expression '0 3 * * ? *' \
  --invoke-function-id <FUNCTION_ID> \
  --invoke-function-service-account-id <SERVICE_ACCOUNT_ID>
```

Где:
- `0 3 * * ? *` = каждый день в 03:00 UTC (06:00 МСК)
- FUNCTION_ID = ID функции daily-tariff-sync
- SERVICE_ACCOUNT_ID = ID сервисного аккаунта с ролью `serverless.functions.invoker`

### Вариант 3: GitHub Actions (если проект в GitHub)

Создайте `.github/workflows/sync-tariffs.yml`:

```yaml
name: Daily Tariff Sync
on:
  schedule:
    - cron: '0 3 * * *'  # 03:00 UTC каждый день
  workflow_dispatch:  # Позволяет запустить вручную

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger tariff sync
        run: |
          curl -X POST https://functions.poehali.dev/2059700b-27e4-44a2-b539-769b7cec23a0
```

## Ручная синхронизация

### Через UI дашборда
Нажмите кнопку "Обновить тарифы" в заголовке дашборда.

### Через API
```bash
curl -X POST https://functions.poehali.dev/1d38596d-371d-453b-91cd-80200e4d0a2b
```

Ответ:
```json
{
  "success": true,
  "parsed": 20,
  "updated": 20,
  "skipped": 0,
  "errors": [],
  "timestamp": "2025-10-22T12:00:00.000Z"
}
```

## Источники данных

Официальные тарифы 2025 года:
- **Москва**: 7,87 ₽/кВт·ч (https://www.ingos.ru)
- **Санкт-Петербург**: 6,97 ₽/кВт·ч (https://www.ingos.ru)
- **Иркутская область**: 1,77-1,96 ₽/кВт·ч (https://rg.ru, https://ktv-ray.ru)
- **Чукотский АО**: 11,36 ₽/кВт·ч (https://rg.ru)
- **Республика Саха (Якутия)**: 9,66 ₽/кВт·ч (https://vladnews.ru)
- И другие регионы...

## Логи и мониторинг

Проверка последней синхронизации:
```sql
SELECT r.name, ph.price, ph.recorded_at, ph.source 
FROM t_p67469144_energy_price_monitor.price_history ph
JOIN t_p67469144_energy_price_monitor.regions r ON r.id = ph.region_id
WHERE ph.source LIKE 'https%' OR ph.source = 'estimate'
ORDER BY ph.recorded_at DESC
LIMIT 25;
```

## Формат cron-выражения

- `0 3 * * *` — каждый день в 03:00
- `0 */6 * * *` — каждые 6 часов
- `0 0 * * 1` — каждый понедельник в 00:00
- `0 0 1 * *` — первое число каждого месяца в 00:00
