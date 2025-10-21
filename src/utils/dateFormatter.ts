/**
 * Форматирует дату для отображения на графиках
 * Если период данных больше года - добавляет год к подписи
 */
export const formatDateForChart = (
  date: Date | string,
  allDates: (Date | string)[],
  language: 'ru' | 'en' = 'ru'
): string => {
  const currentDate = typeof date === 'string' ? new Date(date) : date;
  
  // Если нет других дат для сравнения, показываем с годом
  if (allDates.length === 0) {
    return currentDate.toLocaleDateString(
      language === 'en' ? 'en-GB' : 'ru-RU',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
  }
  
  // Находим минимальную и максимальную даты
  const dates = allDates.map(d => typeof d === 'string' ? new Date(d) : d);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Вычисляем разницу в днях
  const daysDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Если период больше года (365 дней), показываем год
  const showYear = daysDiff > 365;
  
  if (showYear) {
    return currentDate.toLocaleDateString(
      language === 'en' ? 'en-GB' : 'ru-RU',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
  } else {
    return currentDate.toLocaleDateString(
      language === 'en' ? 'en-GB' : 'ru-RU',
      { day: '2-digit', month: 'short' }
    );
  }
};

/**
 * Упрощённая версия для массива точек истории
 */
export const shouldShowYear = (dates: (Date | string)[]): boolean => {
  if (dates.length < 2) return false;
  
  const parsedDates = dates.map(d => typeof d === 'string' ? new Date(d) : d);
  const minDate = new Date(Math.min(...parsedDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...parsedDates.map(d => d.getTime())));
  
  const daysDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysDiff > 365;
};