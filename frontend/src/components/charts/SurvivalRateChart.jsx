import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip, ChartPercentageDisplay, ChartLegend } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useChartConfig } from '../../hooks/useChartConfig';
import { useSurvivalRateData } from '../../hooks/useChartData';


export const SurvivalRateChart = ({ filters = {} }) => {
  const { data: apiData, loading, error } = useSurvivalRateData(filters);
  
  // Calculate survival rate from API data or use default
  const survivalRate = apiData?.chartData?.length > 0 
    ? apiData.chartData[apiData.chartData.length - 1]?.survivalRate || 0
    : 0;
  
  const data = {
    survived: survivalRate,
    lost: 100 - survivalRate
  };
  const chartConfig = useChartConfig('pie');
  const chartData = [
    { name: 'Survived', value: data.survived, color: '#10b981' },
    { name: 'Lost', value: data.lost, color: '#ef4444' }
  ];

  if (loading) {
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

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Tree Survival Rate</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-48">
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
        <ChartTitle>Tree Survival Rate</ChartTitle>
      </ChartHeader>
      
      <ChartPercentageDisplay value={data.survived} label="Survival Rate" />

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={chartConfig.innerRadius}
            outerRadius={chartConfig.outerRadius}
            paddingAngle={chartConfig.paddingAngle}
            dataKey="value"
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