import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Simple survival rate chart without styled-components dependencies
export const SurvivalRateChart = ({ filters = {}, dashboardData = null }) => {
  // Mock data for now to avoid API dependencies
  const data = [
    { name: 'Alive', value: 88, count: 2400 },
    { name: 'Dead', value: 12, count: 327 }
  ];

  const COLORS = {
    'Alive': '#10B981',
    'Dead': '#EF4444'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tree Survival Rate
        </h3>
        <div className="text-3xl font-bold text-green-600 mt-2">
          88%
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Survival Rate</p>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, 'Percentage']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '6px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Simple CO2 chart
export const CO2AbsorptionChart = ({ filters = {}, dashboardData = null }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          CO2 Absorption
        </h3>
        <div className="text-3xl font-bold text-blue-600 mt-2">
          1,247 t
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total CO2 Absorbed</p>
      </div>
      
      <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg flex items-end justify-center p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Detailed chart loading...
        </div>
      </div>
    </div>
  );
};

// Simple forest value chart
export const ForestValueAppreciationChart = ({ filters = {}, dashboardData = null }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Forest Value Appreciation
        </h3>
        <div className="text-3xl font-bold text-purple-600 mt-2">
          €2.4M
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
      </div>
      
      <div className="h-32 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex items-end justify-center p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Growth trend: +12.5% YoY
        </div>
      </div>
    </div>
  );
};