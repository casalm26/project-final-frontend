import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle, ChartTooltip } from '../ui/ChartComponents';
import { useChartConfig } from '../../hooks/useChartConfig';

const DEFAULT_DATA = [
  { month: 'Jan', co2: 0.8 },
  { month: 'Feb', co2: 1.2 },
  { month: 'Mar', co2: 1.6 },
  { month: 'Apr', co2: 2.0 },
  { month: 'May', co2: 2.4 },
  { month: 'Jun', co2: 2.8 },
  { month: 'Jul', co2: 3.2 },
  { month: 'Aug', co2: 3.6 },
  { month: 'Sep', co2: 4.0 },
  { month: 'Oct', co2: 4.4 },
  { month: 'Nov', co2: 4.8 },
  { month: 'Dec', co2: 5.2 }
];

export const CO2AbsorptionChart = ({ data = DEFAULT_DATA }) => {
  const chartConfig = useChartConfig('bar');

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>CO₂ Absorption Over Time</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={chartConfig.margin}>
          <CartesianGrid {...chartConfig.gridProps} />
          <XAxis 
            dataKey="month" 
            {...chartConfig.axisProps}
          />
          <YAxis 
            {...chartConfig.axisProps}
            label={{ value: 'CO₂ (tons)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltip valueFormatter={(value) => `CO₂ Absorption: ${value} tons`} />} />
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