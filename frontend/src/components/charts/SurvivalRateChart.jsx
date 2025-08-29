import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip, ChartPercentageDisplay, ChartLegend } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useChartConfig } from '../../hooks/useChartConfig';
import { useSurvivalRateData } from '../../hooks/useChartData';


const SurvivalRateChartComponent = ({ filters = {}, dashboardData = null }) => {
  // Use dashboard data if available, otherwise fetch from API
  const { data: apiData, loading, error } = useSurvivalRateData(
    dashboardData ? {} : filters, // Skip API call if we have dashboard data
    { skip: !!dashboardData }
  );
  
  // Use dashboard data first, then API data
  const rawChartData = dashboardData?.charts?.survivalRate || apiData;
  
  // Calculate survival rate from available data
  const survivalRate = rawChartData?.chartData?.length > 0 
    ? rawChartData.chartData[rawChartData.chartData.length - 1]?.survivalRate || 0
    : 0;
    
  // If using dashboard data, no loading state needed
  const isLoading = dashboardData ? false : loading;
  const hasError = dashboardData ? false : error;
  
  const data = {
    survived: survivalRate,
    lost: 100 - survivalRate
  };
  const chartConfig = useChartConfig('pie');
  const chartData = [
    { name: 'Survived', value: data.survived, color: '#10b981' },
    { name: 'Lost', value: data.lost, color: '#ef4444' }
  ];

  if (isLoading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Tree Survival Rate</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner size="32px" text="Loading chart data..." />
        </div>
      </ChartContainer>
    );
  }

  if (hasError) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Tree Survival Rate</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-48">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading chart data</p>
            <p className="text-sm text-gray-500">{hasError}</p>
          </div>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer role="img" aria-label={`Tree Survival Rate chart showing ${data.survived.toFixed(1)}% survival rate`}>
      <ChartHeader>
        <ChartTitle>Tree Survival Rate</ChartTitle>
      </ChartHeader>
      
      <ChartPercentageDisplay value={data.survived} label="Survival Rate" />

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={chartConfig.innerRadius}
            outerRadius={chartConfig.outerRadius}
            paddingAngle={chartConfig.paddingAngle}
            dataKey="value"
            aria-hidden="true"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip valueFormatter={(value) => `${value.toFixed(1)}%`} />} />
        </PieChart>
      </ResponsiveContainer>

      <ChartLegend data={chartData} />
    </ChartContainer>
  );
}; 

// Memoize component to prevent unnecessary re-renders
export const SurvivalRateChart = memo(SurvivalRateChartComponent);