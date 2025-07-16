import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip, ChartPercentageDisplay, ChartLegend } from '../ui/ChartComponents';
import { useChartConfig } from '../../hooks/useChartConfig';


export const SurvivalRateChart = ({ data = { survived: 95.2, lost: 4.8 } }) => {
  const chartConfig = useChartConfig('pie');
  const chartData = [
    { name: 'Survived', value: data.survived, color: '#10b981' },
    { name: 'Lost', value: data.lost, color: '#ef4444' }
  ];

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
          <Tooltip content={<ChartTooltip valueFormatter={(value) => `${value}%`} />} />
        </PieChart>
      </ResponsiveContainer>

      <ChartLegend data={chartData} />
    </ChartContainer>
  );
}; 