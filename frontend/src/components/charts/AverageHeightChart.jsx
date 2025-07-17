import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useChartConfig } from '../../hooks/useChartConfig';
import { useHeightGrowthData } from '../../hooks/useChartData';

export const AverageHeightChart = ({ filters = {} }) => {
  const { data: apiData, loading, error } = useHeightGrowthData(filters);
  
  // Transform API data to chart format
  const data = apiData?.chartData?.map(item => ({
    period: item.period,
    height: item.species?.reduce((acc, species) => acc + species.avgHeight, 0) / (item.species?.length || 1) || 0
  })) || [];
  const chartConfig = useChartConfig('line');

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Average Tree Height Over Time</ChartTitle>
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
          <ChartTitle>Average Tree Height Over Time</ChartTitle>
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
        <ChartTitle>Average Tree Height Over Time</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.gridProps} />
          <XAxis 
            dataKey="period" 
            {...chartConfig.axisProps}
          />
          <YAxis 
            {...chartConfig.axisProps}
            label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltip valueFormatter={(value) => `Average Height: ${value.toFixed(1)}m`} />} />
          <Line 
            type="monotone" 
            dataKey="height" 
            stroke="#10b981" 
            strokeWidth={chartConfig.strokeWidth}
            dot={{ fill: '#10b981', ...chartConfig.dot }}
            activeDot={{ r: 6, stroke: '#10b981', ...chartConfig.activeDot }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 