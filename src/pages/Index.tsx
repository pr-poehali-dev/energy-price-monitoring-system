import { useEffect, useCallback } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import StatsCards from '@/components/energy/StatsCards';
import OverviewTab from '@/components/energy/OverviewTab';
import RegionsTab from '@/components/energy/RegionsTab';
import AnalyticsTab from '@/components/energy/AnalyticsTab';
import CompareTab from '@/components/energy/CompareTab';
import FilterPanel from '@/components/energy/FilterPanel';
import MapTab from '@/components/energy/MapTab';
import ForecastTab from '@/components/energy/ForecastTab';
import DashboardHeader from '@/components/energy/DashboardHeader';
import DashboardTabs from '@/components/energy/DashboardTabs';
import { useEnergyData } from '@/hooks/useEnergyData';
import { useEnergyFilters } from '@/hooks/useEnergyFilters';
import { processChartData } from '@/utils/chartDataProcessor';

export default function Index() {
  const { t, language } = useLanguage();
  
  const {
    regions,
    zoneStats,
    selectedRegion,
    setSelectedRegion,
    regionHistory,
    loading,
    historyLoading,
    selectedAnalyticsRegions,
    setSelectedAnalyticsRegions,
    multiRegionData,
    setMultiRegionData,
    multiRegionLoading,
    allRegionsHistory,
    fetchRegionHistory,
    fetchMultiRegionHistory
  } = useEnergyData(language as 'ru' | 'en');

  const {
    filters,
    setFilters,
    filteredRegions,
    resetFilters,
    maxPrice
  } = useEnergyFilters(regions);

  useEffect(() => {
    if (selectedRegion) {
      const days = filters.period === 'all' ? 3650 : parseInt(filters.period);
      fetchRegionHistory(selectedRegion.id, days);
    }
  }, [selectedRegion, filters.period]);

  useEffect(() => {
    if (selectedAnalyticsRegions.length > 0) {
      const days = filters.period === 'all' ? 3650 : parseInt(filters.period);
      fetchMultiRegionHistory(selectedAnalyticsRegions, days);
    } else {
      setMultiRegionData([]);
    }
  }, [selectedAnalyticsRegions, filters.period]);

  const getChartData = useCallback(() => {
    return processChartData(regionHistory, filters, language as 'ru' | 'en');
  }, [regionHistory, filters, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!selectedRegion) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />

        <StatsCards regions={filteredRegions} />

        <Tabs defaultValue="overview" className="space-y-6">
          <DashboardTabs />

          <TabsContent value="overview">
            <OverviewTab 
              regions={filteredRegions}
              zoneStats={zoneStats}
              regionHistory={regionHistory}
              historyLoading={historyLoading}
              getChartData={getChartData}
              selectedRegion={selectedRegion}
              onRegionChange={(regionId) => {
                const region = regions.find(r => r.id === regionId);
                if (region) setSelectedRegion(region);
              }}
              period={filters.period}
              onPeriodChange={(period) => setFilters(prev => ({ ...prev, period }))}
              tariffStructure={filters.tariffStructure}
              consumerType={filters.consumerType}
              displayMode={filters.displayMode}
              onDisplayModeChange={(mode) => setFilters(prev => ({ ...prev, displayMode: mode }))}
            />
          </TabsContent>

          <TabsContent value="forecast">
            <ForecastTab 
              regions={filteredRegions}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              regionHistory={regionHistory}
              historyLoading={historyLoading}
              allRegionsHistory={allRegionsHistory}
            />
          </TabsContent>

          <TabsContent value="map">
            <MapTab 
              regions={filteredRegions}
              onSelectRegion={setSelectedRegion}
            />
          </TabsContent>

          <TabsContent value="regions">
            <RegionsTab 
              regions={filteredRegions}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab
              regions={filteredRegions}
              selectedRegions={selectedAnalyticsRegions}
              onSelectedRegionsChange={setSelectedAnalyticsRegions}
              multiRegionData={multiRegionData}
              multiRegionLoading={multiRegionLoading}
              period={filters.period}
              onPeriodChange={(period) => setFilters(prev => ({ ...prev, period }))}
              regionHistory={regionHistory}
              historyLoading={historyLoading}
              calculateTrend={(history) => {
                if (history.length < 2) return t('trend.stable');
                const firstPrice = history[0]?.avg_price || 0;
                const lastPrice = history[history.length - 1]?.avg_price || 0;
                const change = ((lastPrice - firstPrice) / firstPrice) * 100;
                if (Math.abs(change) < 1) return t('trend.stable');
                if (change > 10) return t('trend.risingSignificantly');
                if (change > 5) return t('trend.risingNoticeably');
                if (change > 0) return t('trend.risingSlightly');
                if (change < -10) return t('trend.fallingSignificantly');
                if (change < -5) return t('trend.fallingNoticeably');
                return t('trend.fallingSlightly');
              }}
              getChartData={getChartData}
              selectedRegion={selectedRegion}
            />
          </TabsContent>

          <TabsContent value="compare">
            <CompareTab 
              regions={filteredRegions}
              zoneStats={zoneStats}
            />
          </TabsContent>

          <TabsContent value="filters">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              zoneStats={zoneStats}
              maxPrice={maxPrice}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}