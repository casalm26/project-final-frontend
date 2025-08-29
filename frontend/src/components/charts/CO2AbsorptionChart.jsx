import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useChartConfig } from '../../hooks/useChartConfig';
import { useCO2AbsorptionData } from '../../hooks/useChartData';

const CO2AbsorptionChartComponent = ({ filters = {}, dashboardData = null }) => {
  // Force yearly grouping for this chart
  const yearlyFilters = { ...filters, groupBy: 'year' };
  const { data: apiData, loading, error } = useCO2AbsorptionData(
    dashboardData ? {} : yearlyFilters,
    { skip: !!dashboardData }
  );
  
  // Use dashboard data first, then API data
  const chartData = dashboardData?.charts?.co2Absorption || apiData;
  
  // Transform data to chart format - show quarters/periods
  const data = chartData?.chartData?.map(item => ({
    year: item.period, // Period from data
    co2: item.totalAbsorption || 0
  })) || [];
  const chartConfig = useChartConfig('bar');

  // If using dashboard data, no loading state needed
  const isLoading = dashboardData ? false : loading;
  const hasError = dashboardData ? false : error;

  if (isLoading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>CO₂ Absorption by Year</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading chart data..." />
        </div>
      </ChartContainer>
    );
  }

  if (hasError) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>CO₂ Absorption by Year</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading chart data</p>
            <p className="text-sm text-gray-500">{hasError}</p>
          </div>
        </div>
      </ChartContainer>
    );
  }

  const totalCO2 = data.reduce((sum, item) => sum + item.co2, 0);
  
  return (
    <ChartContainer role="img" aria-label={`CO₂ Absorption chart showing ${totalCO2.toFixed(1)} total tons absorbed over ${data.length} years`}>
      <ChartHeader>
        <ChartTitle>CO₂ Absorption Over Time</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.gridProps} />
          <XAxis 
            dataKey="year" 
            {...chartConfig.axisProps}
          />
          <YAxis 
            {...chartConfig.axisProps}
            label={{ value: 'CO₂ (tons)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltip valueFormatter={(value) => `CO₂ Absorption: ${value.toFixed(1)} tons`} />} />
          <Bar 
            dataKey="co2" 
            fill="#8b5cf6"
            radius={chartConfig.radius}
            aria-hidden="true"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 

// Memoize component to prevent unnecessary re-renders
export const CO2AbsorptionChart = memo(CO2AbsorptionChartComponent);