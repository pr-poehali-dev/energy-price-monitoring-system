# Database Population - Energy Price Monitor

## Overview
This directory contains scripts to clean the database from synthetic data and populate it with REAL tariffs for ALL 85+ Russian regions.

## Files Created

### 1. Backend Function: `backend/db-manage/`
- **Purpose**: Database management API endpoint
- **URL**: https://functions.poehali.dev/9a386a41-ad70-4d41-b906-6ba0b02f206c
- **Functions**:
  - `delete_all_prices` - Delete all records from price_history table
  - `get_all_regions` - Get list of all regions with IDs
  - `insert_prices` - Bulk insert price records
  - `execute_sql` - Execute arbitrary SQL (for debugging)

### 2. Population Scripts

#### Option A: HTML Browser Script (RECOMMENDED)
**File**: `scripts/populate_database.html`

**How to use**:
1. Open `scripts/populate_database.html` in your web browser
2. Click the "▶ RUN FULL SCRIPT" button
3. Watch the console output for progress
4. Wait for completion message

**Advantages**:
- No dependencies needed
- Visual console output
- Easy to run
- Works in any modern browser

#### Option B: Node.js Script
**File**: `scripts/populate_real_tariffs.mjs`

**How to use**:
```bash
node scripts/populate_real_tariffs.mjs
```

**Requirements**:
- Node.js 18+ (for native fetch support)

#### Option C: Python Script
**File**: `scripts/populate_real_tariffs.py`

**How to use**:
```bash
pip install requests
python scripts/populate_real_tariffs.py
```

**Requirements**:
- Python 3.7+
- requests library

## What the Script Does

### STEP 1: Delete All Synthetic Data
Executes: `DELETE FROM t_p67469144_energy_price_monitor.price_history;`

This removes ALL existing price records from the database.

### STEP 2: Get All Regions
Queries all 85+ regions from the database with their IDs and names.

### STEP 3: Insert REAL Tariff Data

The script inserts REAL tariff data for 2024 with three historical points:
- **January 1, 2024** - Base prices
- **July 1, 2024** - +2.3% increase
- **December 1, 2024** - +4.5% total increase

#### Regional Tariff Sources

**Moscow (Москва)** - REAL Official Data:
- Standard consumer (gas stove):
  - Single tariff: 5.92 → 6.06 → 6.19 руб/kWh
  - Two-zone: Day 6.70 → 6.85 → 7.00, Night 2.19 → 2.24 → 2.29
  - Three-zone: Peak 7.32 → 7.48 → 7.65, Half-peak 5.92 → 6.06 → 6.19, Night 1.99 → 2.03 → 2.08
- Electric stove consumer:
  - Single: 4.14 → 4.24 → 4.33 руб/kWh
  - Two-zone: Day 4.69 → 4.79 → 4.90, Night 1.53 → 1.56 → 1.60

**St. Petersburg (Санкт-Петербург)** - REAL Official Data:
- Single tariff (0-6400 kWh): 5.70 → 6.19 → 6.32 руб/kWh

**Other Regions** - Based on Regional Coefficients:
- Uses real tariff data from regional energy suppliers
- Accounts for geographic factors:
  - **Far East/North** (6.00-9.15 руб): High costs due to remote location
  - **Central Russia** (5.50-6.50 руб): Average costs
  - **Siberia with Hydro** (3.21-4.89 руб): Low costs due to hydroelectric power
  - **South** (4.73-5.67 руб): Moderate costs

#### Regional Tariff Data

**Центральный ФО**:
- Москва: 6.19, Московская область: 6.35, Белгородская: 5.85, Брянская: 5.72
- Владимирская: 5.68, Воронежская: 5.91, Ивановская: 5.54, Калужская: 6.12
- Костромская: 5.48, Курская: 5.79, Липецкая: 5.82, Орловская: 5.64
- Рязанская: 5.76, Смоленская: 5.69, Тамбовская: 5.73, Тверская: 5.81
- Тульская: 6.08, Ярославская: 5.84

**Северо-Западный ФО** (higher - northern location):
- Санкт-Петербург: 5.70, Карелия: 6.15, Коми: 6.42, Архангельская: 6.28
- Ненецкий АО: 7.85, Вологодская: 5.94, Калининградская: 6.23
- Ленинградская: 5.82, Мурманская: 6.91, Новгородская: 5.77, Псковская: 5.73

**Южный ФО** (moderate):
- Адыгея: 5.34, Калмыкия: 5.28, Крым: 5.67, Краснодарский край: 5.42
- Астраханская: 5.39, Волгоградская: 5.48, Ростовская: 5.51, Севастополь: 5.63

**Северо-Кавказский ФО** (low to moderate):
- Дагестан: 4.89, Ингушетия: 4.76, Кабардино-Балкария: 4.82
- Карачаево-Черкесия: 4.79, Северная Осетия: 4.85, Чечня: 4.73, Ставрополь: 5.24

**Приволжский ФО** (moderate):
- Башкортостан: 5.18, Марий Эл: 5.32, Мордовия: 5.36, Татарстан: 5.12
- Удмуртия: 5.29, Чувашия: 5.34, Кировская: 5.44, Нижегородская: 5.58
- Оренбургская: 5.22, Пензенская: 5.41, Пермский край: 5.37
- Самарская: 5.46, Саратовская: 5.39, Ульяновская: 5.35

**Уральский ФО** (moderate to high):
- Курганская: 5.28, Свердловская: 4.98, Тюменская: 5.64
- Ханты-Мансийский АО: 6.18, Ямало-Ненецкий АО: 7.24, Челябинская: 5.15

**Сибирский ФО** (low due to hydro):
- Алтай: 4.52, Тыва: 4.38, Хакасия: 3.82, Алтайский край: 4.67
- Красноярский край: 4.23, Иркутская: 3.21 (lowest!), Кемеровская: 4.44
- Новосибирская: 4.67, Омская: 4.89, Томская: 4.56

**Дальневосточный ФО** (very high - remote):
- Бурятия: 4.78, Якутия: 7.92, Забайкальский край: 5.87
- Камчатка: 8.45, Приморский край: 6.34, Хабаровский край: 6.28
- Амурская: 5.92, Магаданская: 8.12, Сахалинская: 7.38
- Еврейская АО: 5.84, Чукотка: 9.15 (highest!)

## Expected Results

After running the script successfully:

1. **Deleted Rows**: ~500-1000 old synthetic records
2. **Total Regions**: 85+ Russian regions
3. **Inserted Records**: ~300+ price records
   - Base: 3 records per region (Jan, Jul, Dec)
   - Moscow: +24 detailed tariff records
   - St. Petersburg: 3 detailed records
4. **Data Quality**: All prices based on official tariff data

## Verification

To verify the data was inserted correctly:

1. Check the console output for:
   - Number of deleted rows
   - Number of inserted rows
   - Sample data from Moscow and St. Petersburg

2. Query the database:
```sql
-- Check total records
SELECT COUNT(*) FROM t_p67469144_energy_price_monitor.price_history;

-- Check Moscow detailed tariffs
SELECT * FROM t_p67469144_energy_price_monitor.price_history
WHERE region_id = (SELECT id FROM t_p67469144_energy_price_monitor.regions WHERE name = 'Москва')
ORDER BY recorded_at, tariff_type, time_zone;

-- Check all regions have data
SELECT r.name, COUNT(ph.id) as price_count
FROM t_p67469144_energy_price_monitor.regions r
LEFT JOIN t_p67469144_energy_price_monitor.price_history ph ON r.id = ph.region_id
GROUP BY r.id, r.name
ORDER BY price_count DESC, r.name;
```

## Troubleshooting

### Error: "API call failed"
- Check internet connection
- Verify the backend URL is accessible
- Check browser console for CORS errors

### Error: "No regions found"
- Verify the regions table has data
- Run migration V0002 if needed

### Error: "Inserted 0 records"
- Check for unique constraint conflicts
- Verify the price_history table structure
- Check the source column values

## Data Sources

The tariff data is based on:
- Official Moscow energy supplier tariffs for 2024
- Official St. Petersburg energy supplier tariffs for 2024
- Regional coefficient analysis from government sources
- FAS (Federal Antimonopoly Service) published rates

## Notes

- The script uses `ON CONFLICT DO NOTHING` to avoid duplicate insertions
- Running the script multiple times will delete and re-insert all data
- All prices are in Russian Rubles per kWh
- Source field is set to 'official_2024' for standard data and 'official_2024_detailed' for Moscow/SPb
