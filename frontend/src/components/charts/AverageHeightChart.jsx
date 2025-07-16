import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip } from '../ui/ChartComponents';
import { useChartConfig } from '../../hooks/useChartConfig';

const DEFAULT_DATA = [
  { month: 'Jan', height: 1.2 },
  { month: 'Feb', height: 1.4 },
  { month: 'Mar', height: 1.6 },
  { month: 'Apr', height: 1.8 },
  { month: 'May', height: 2.0 },
  { month: 'Jun', height: 2.2 },
  { month: 'Jul', height: 2.4 },
  { month: 'Aug', height: 2.6 },
  { month: 'Sep', height: 2.8 },
  { month: 'Oct', height: 3.0 },
  { month: 'Nov', height: 3.2 },
  { month: 'Dec', height: 3.4 }
];

export const AverageHeightChart = ({ data = DEFAULT_DATA }) => {
  const chartConfig = useChartConfig('line');

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Average Tree Height Over Time</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.gridProps} />
          <XAxis 
            dataKey="month" 
            {...chartConfig.axisProps}
          />
          <YAxis 
            {...chartConfig.axisProps}
            label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltip valueFormatter={(value) => `Average Height: ${value}m`} />} />
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