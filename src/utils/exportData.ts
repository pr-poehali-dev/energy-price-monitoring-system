import * as XLSX from 'xlsx';
import type { Region, PriceHistoryPoint } from '@/components/energy/types';
import { toast } from 'sonner';

export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  toast.success('Файл CSV успешно скачан', {
    description: `${filename}.csv`
  });
};

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Данные') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 15)
  }));
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
  toast.success('Файл Excel успешно скачан', {
    description: `${filename}.xlsx`
  });
};

export const exportRegionsToExcel = (regions: Region[]) => {
  const data = regions.map(region => ({
    'Регион': region.name,
    'Федеральный округ': region.zone,
    'Население': region.population,
    'Текущая цена (₽/кВт⋅ч)': region.current_price.toFixed(2),
    'Изменение (%)': region.change,
    'Последнее обновление': region.last_updated || 'Н/Д'
  }));
  
  exportToExcel(data, 'регионы_электроэнергия', 'Регионы');
};

export const exportRegionsToCSV = (regions: Region[]) => {
  const data = regions.map(region => ({
    'Регион': region.name,
    'Федеральный округ': region.zone,
    'Население': region.population,
    'Текущая цена (₽/кВт⋅ч)': region.current_price.toFixed(2),
    'Изменение (%)': region.change,
    'Последнее обновление': region.last_updated || 'Н/Д'
  }));
  
  exportToCSV(data, 'регионы_электроэнергия');
};

export const exportHistoryToExcel = (history: PriceHistoryPoint[], regionName: string) => {
  const data = history.map(point => ({
    'Дата': new Date(point.recorded_at).toLocaleDateString('ru-RU'),
    'Цена (₽/кВт⋅ч)': parseFloat(point.price.toString()).toFixed(2)
  }));
  
  exportToExcel(data, `история_цен_${regionName.replace(/\s+/g, '_')}`, 'История цен');
};

export const exportHistoryToCSV = (history: PriceHistoryPoint[], regionName: string) => {
  const data = history.map(point => ({
    'Дата': new Date(point.recorded_at).toLocaleDateString('ru-RU'),
    'Цена (₽/кВт⋅ч)': parseFloat(point.price.toString()).toFixed(2)
  }));
  
  exportToCSV(data, `история_цен_${regionName.replace(/\s+/g, '_')}`);
};

export const exportMultiRegionHistoryToExcel = (
  multiRegionData: any[], 
  regions: Region[], 
  selectedRegionIds: number[]
) => {
  const data = multiRegionData.map(point => {
    const row: any = { 'Дата': point.date };
    selectedRegionIds.forEach(regionId => {
      const region = regions.find(r => r.id === regionId);
      const regionName = region?.name || `Регион ${regionId}`;
      row[regionName] = point[`region_${regionId}`]?.toFixed(2) || 'Н/Д';
    });
    return row;
  });
  
  exportToExcel(data, 'сравнение_регионов', 'Сравнение цен');
};

export const exportMultiRegionHistoryToCSV = (
  multiRegionData: any[], 
  regions: Region[], 
  selectedRegionIds: number[]
) => {
  const data = multiRegionData.map(point => {
    const row: any = { 'Дата': point.date };
    selectedRegionIds.forEach(regionId => {
      const region = regions.find(r => r.id === regionId);
      const regionName = region?.name || `Регион ${regionId}`;
      row[regionName] = point[`region_${regionId}`]?.toFixed(2) || 'Н/Д';
    });
    return row;
  });
  
  exportToCSV(data, 'сравнение_регионов');
};