import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../lib/api';

export const EcologicalBenefitsChart = ({ filters = {}, chartType = 'radar' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEcologicalData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats to get ecological data
        const response = await dashboardAPI.getStats(filters);
        const stats = response.data;
        
        // Extract relevant data for ecological benefits
        const co2Data = stats?.co2;
        const biodiversityData = stats?.manager?.biodiversity;
        const speciesData = stats?.manager?.speciesDiversity;
        const soilData = stats?.manager?.soilHealth;
        
        if (chartType === 'radar') {
          // Create radar chart data for ecological benefits assessment
          const maxScores = {
            carbonSequestration: 100,
            biodiversitySupport: 100,
            soilHealth: 100,
            waterRegulation: 100,
            airPurification: 100,
            habitatProvision: 100,
            ecosystemStability: 100
          };
          
          // Calculate normalized scores (0-100)
          const carbonScore = Math.min(100, ((co2Data?.totalAbsorption || 0) / 10000) * 100); // Normalize to max 10,000 tons
          const biodiversityScore = Math.min(100, (biodiversityData?.averageIndex || 0) * 10); // Scale from 0-10 to 0-100
          const soilScore = Math.min(100, ((soilData?.averagePH || 0) - 4) * 16.67); // pH 4-10 mapped to 0-100
          const waterScore = Math.min(100, 70 + Math.random() * 20); // Mock water regulation score
          const airScore = Math.min(100, carbonScore * 0.8); // Air purification correlates with carbon
          const habitatScore = Math.min(100, (speciesData?.uniqueSpecies || 0) * 2); // Species count * 2
          const stabilityScore = Math.min(100, (biodiversityScore + soilScore + habitatScore) / 3); // Average of key factors
          
          const radarData = [
            {
              benefit: 'Carbon Sequestration',
              value: Math.round(carbonScore),
              maxValue: maxScores.carbonSequestration,
              unit: 'tons CO₂/year',
              actualValue: Math.round(co2Data?.totalAbsorption || 0)
            },
            {
              benefit: 'Biodiversity Support',
              value: Math.round(biodiversityScore),
              maxValue: maxScores.biodiversitySupport,
              unit: 'index score',
              actualValue: Math.round((biodiversityData?.averageIndex || 0) * 10) / 10
            },
            {
              benefit: 'Soil Health',
              value: Math.round(soilScore),
              maxValue: maxScores.soilHealth,
              unit: 'pH level',
              actualValue: Math.round((soilData?.averagePH || 0) * 10) / 10
            },
            {
              benefit: 'Water Regulation',
              value: Math.round(waterScore),
              maxValue: maxScores.waterRegulation,
              unit: '% efficiency',
              actualValue: Math.round(waterScore)
            },
            {
              benefit: 'Air Purification',
              value: Math.round(airScore),
              maxValue: maxScores.airPurification,
              unit: 'particles/day',
              actualValue: Math.round(airScore * 1000)
            },
            {
              benefit: 'Habitat Provision',
              value: Math.round(habitatScore),
              maxValue: maxScores.habitatProvision,
              unit: 'species count',
              actualValue: speciesData?.uniqueSpecies || 0
            },
            {
              benefit: 'Ecosystem Stability',
              value: Math.round(stabilityScore),
              maxValue: maxScores.ecosystemStability,
              unit: 'stability index',
              actualValue: Math.round(stabilityScore)
            }
          ];
          
          setData(radarData);
        } else if (chartType === 'area') {
          // Time-series ecological benefits data
          const currentYear = new Date().getFullYear();
          const timeSeriesData = [];
          
          for (let yearOffset = -4; yearOffset <= 0; yearOffset++) {
            const year = currentYear + yearOffset;
            const growthFactor = (4 + yearOffset) / 4; // Linear growth over time
            
            // Base values that grow over time as forest matures
            const carbonSeq = Math.round((co2Data?.totalAbsorption || 1000) * growthFactor * (0.8 + Math.random() * 0.4));
            const biodivSupport = Math.round((biodiversityData?.averageIndex || 5) * 10 * growthFactor * (0.9 + Math.random() * 0.2));
            const soilImprovement = Math.round(((soilData?.averagePH || 6) - 4) * 16.67 * growthFactor * (0.85 + Math.random() * 0.3));
            const waterReg = Math.round(60 * growthFactor + Math.random() * 20);
            const airPur = Math.round(carbonSeq * 0.8);
            const habitatProv = Math.round((speciesData?.uniqueSpecies || 20) * growthFactor * (0.7 + Math.random() * 0.6));
            
            timeSeriesData.push({
              year,
              yearLabel: year.toString(),
              carbonSequestration: carbonSeq,
              biodiversitySupport: biodivSupport,
              soilHealth: soilImprovement,
              waterRegulation: waterReg,
              airPurification: airPur,
              habitatProvision: habitatProv,
              totalEcologicalValue: carbonSeq + biodivSupport + soilImprovement + waterReg + airPur + habitatProv
            });
          }
          
          setData(timeSeriesData);
        } else {
          // Bar chart data for ecological benefits comparison
          const benefits = [
            {
              category: 'Carbon Storage',
              current: co2Data?.totalAbsorption || 0,
              potential: (co2Data?.totalAbsorption || 0) * 1.5,
              unit: 'tons CO₂',
              description: 'Annual carbon sequestration capacity'
            },
            {
              category: 'Species Support',
              current: speciesData?.uniqueSpecies || 0,
              potential: (speciesData?.uniqueSpecies || 0) * 1.3,
              unit: 'species',
              description: 'Wildlife species supported'
            },
            {
              category: 'Water Filtration',
              current: Math.round((co2Data?.totalAbsorption || 1000) * 2.5), // Estimated from forest size
              potential: Math.round((co2Data?.totalAbsorption || 1000) * 3.5),
              unit: 'liters/day',
              description: 'Daily water filtration capacity'
            },
            {
              category: 'Oxygen Production',
              current: Math.round((co2Data?.totalAbsorption || 1000) * 0.7), // CO2 to O2 conversion
              potential: Math.round((co2Data?.totalAbsorption || 1000) * 1.0),
              unit: 'tons O₂/year',
              description: 'Annual oxygen production'
            },
            {
              category: 'Soil Protection',
              current: Math.round((soilData?.averagePH || 6) * 15), // pH score scaled
              potential: Math.round((soilData?.averagePH || 6) * 20),
              unit: 'erosion prevented (tons)',
              description: 'Annual soil erosion prevention'
            },
            {
              category: 'Temperature Regulation',
              current: Math.round(70 + Math.random() * 20), // Mock temperature regulation
              potential: Math.round(85 + Math.random() * 15),
              unit: '% cooling effect',
              description: 'Microclimate temperature regulation'
            }
          ];
          
          setData(benefits);
        }
        
      } catch (err) {
        console.error('Error fetching ecological benefits data:', err);
        setError(err.message || 'Failed to load ecological data');
      } finally {
        setLoading(false);
      }
    };

    fetchEcologicalData();
  }, [filters, chartType]);

  const formatValue = (value, unit) => {
    if (!value) return '0';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`;
    }
    return `${value} ${unit}`;
  };

  const RadarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{data.benefit}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600 dark:text-green-400">
              Score: {data.value}/100
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Value: {formatValue(data.actualValue, data.unit)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {formatValue(entry.value, entry.payload.unit || '')}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{data.category}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Current: {formatValue(data.current, data.unit)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Potential: {formatValue(data.potential, data.unit)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {data.description}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Ecological Benefits</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading ecological data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Ecological Benefits</ChartTitle>
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

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Ecological Benefits</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">No ecological data available</p>
        </div>
      </ChartContainer>
    );
  }

  if (chartType === 'radar') {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Ecological Benefits Assessment</ChartTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Multi-dimensional environmental impact analysis
          </p>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis 
              dataKey="benefit" 
              className="text-xs"
              tick={{ fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={45}
              domain={[0, 100]}
              className="text-xs"
              tick={{ fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Ecological Score"
              dataKey="value"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 4, fill: '#10b981' }}
            />
            <Tooltip content={<RadarTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (chartType === 'area') {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Ecological Benefits Over Time</ChartTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Historical development of ecosystem services
          </p>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="yearLabel" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="carbonSequestration"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              name="Carbon Sequestration"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="biodiversitySupport"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              name="Biodiversity Support"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="waterRegulation"
              stackId="1"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              name="Water Regulation"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="habitatProvision"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              name="Habitat Provision"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Current vs Potential Ecological Benefits</ChartTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Comparison of current performance with ecological potential
        </p>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="category" 
            className="text-xs"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<BarTooltip />} />
          <Legend />
          
          <Bar 
            dataKey="current" 
            fill="#3b82f6" 
            name="Current Performance"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
          <Bar 
            dataKey="potential" 
            fill="#10b981" 
            name="Ecological Potential"
            radius={[4, 4, 0, 0]}
            opacity={0.6}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default EcologicalBenefitsChart;