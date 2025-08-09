import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useChartConfig } from '../../hooks/useChartConfig';
import { useCO2AbsorptionData } from '../../hooks/useChartData';

export const CO2AbsorptionChart = ({ filters = {} }) => {
  const { data: apiData, loading, error } = useCO2AbsorptionData(filters);
  
  // Transform API data to chart format
  const data = apiData?.chartData?.map(item => ({
    period: item.period,
    co2: item.totalCO2 || 0
  })) || [];
  const chartConfig = useChartConfig('bar');

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>CO₂ Absorption Over Time</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading chart data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>CO₂ Absorption Over Time</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading chart data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>CO₂ Absorption Over Time</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.gridProps} />
          <XAxis 
            dataKey="period" 
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
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 