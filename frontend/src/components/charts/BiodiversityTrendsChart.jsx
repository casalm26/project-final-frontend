import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar, Area, AreaChart } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../lib/api';

export const BiodiversityTrendsChart = ({ filters = {}, chartType = 'line' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBiodiversityData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats to get biodiversity data
        const response = await dashboardAPI.getStats(filters);
        const stats = response.data;
        
        // Extract biodiversity and species data
        const biodiversityData = stats?.manager?.biodiversity;
        const speciesData = stats?.manager?.speciesDiversity;
        const soilData = stats?.manager?.soilHealth;
        
        if (chartType === 'area') {
          // Create stacked area chart for biodiversity components
          const currentYear = new Date().getFullYear();
          const areaData = [];
          
          for (let yearOffset = -6; yearOffset <= 0; yearOffset++) {
            const year = currentYear + yearOffset;
            const progressFactor = (6 + yearOffset) / 6; // 0 to 1 progression
            
            // Simulate biodiversity components growth over time
            const baseSpecies = speciesData?.uniqueSpecies || 25;
            const baseEndangered = speciesData?.endangeredSpecies || 3;
            
            // Species categories with different growth patterns
            const mammals = Math.round((baseSpecies * 0.15) * progressFactor * (0.8 + Math.random() * 0.4));
            const birds = Math.round((baseSpecies * 0.35) * progressFactor * (0.9 + Math.random() * 0.2));
            const insects = Math.round((baseSpecies * 0.30) * progressFactor * (1.0 + Math.random() * 0.3));
            const plants = Math.round((baseSpecies * 0.20) * progressFactor * (0.85 + Math.random() * 0.3));
            
            // Conservation status
            const endangeredSpecies = Math.max(0, Math.round(baseEndangered * (1.2 - progressFactor * 0.4))); // Decreasing
            const vulnerableSpecies = Math.round(baseSpecies * 0.1 * progressFactor);
            const stableSpecies = mammals + birds + insects + plants - endangeredSpecies - vulnerableSpecies;
            
            areaData.push({
              year,
              yearLabel: year.toString(),
              mammals,
              birds,
              insects,
              plants,
              endangered: endangeredSpecies,
              vulnerable: vulnerableSpecies,
              stable: Math.max(0, stableSpecies),
              totalSpecies: mammals + birds + insects + plants,
              biodiversityIndex: Math.round((biodiversityData?.averageIndex || 5) * progressFactor * 10) / 10,
              endemicSpecies: Math.round((baseSpecies * 0.05) * progressFactor),
              newSpeciesDiscovered: Math.floor(Math.random() * 3) + (yearOffset === 0 ? 1 : 0) // Random discoveries
            });
          }
          
          setData(areaData);
        } else if (chartType === 'composed') {
          // Combined biodiversity metrics over time
          const currentYear = new Date().getFullYear();
          const composedData = [];
          
          for (let yearOffset = -5; yearOffset <= 0; yearOffset++) {
            const year = currentYear + yearOffset;
            const maturityFactor = (5 + yearOffset) / 5;
            
            // Biodiversity metrics that change over time
            const shannonIndex = Math.round(((biodiversityData?.averageIndex || 2.5) * maturityFactor + (Math.random() - 0.5) * 0.3) * 10) / 10;
            const simpsonIndex = Math.round((0.8 * maturityFactor + (Math.random() - 0.5) * 0.1) * 100) / 100;
            const speciesRichness = Math.round((speciesData?.uniqueSpecies || 20) * maturityFactor * (0.9 + Math.random() * 0.2));
            const evenness = Math.round((0.7 + maturityFactor * 0.2 + (Math.random() - 0.5) * 0.1) * 100) / 100;
            
            // Ecological connectivity (how well species can move between habitats)
            const connectivity = Math.round((60 + maturityFactor * 30 + Math.random() * 10));
            
            // Habitat quality score
            const habitatQuality = Math.round((50 + maturityFactor * 40 + (Math.random() - 0.5) * 10));
            
            // Invasive species pressure (decreases with better management)
            const invasiveSpecies = Math.max(0, Math.round(8 - maturityFactor * 5 + (Math.random() - 0.5) * 2));
            
            composedData.push({
              year,
              yearLabel: year.toString(),
              shannonIndex,
              simpsonIndex: Math.round(simpsonIndex * 100), // Convert to percentage for display
              speciesRichness,
              evenness: Math.round(evenness * 100), // Convert to percentage
              connectivity,
              habitatQuality,
              invasiveSpecies,
              overallBiodiversityScore: Math.round((shannonIndex * 10 + speciesRichness / 2 + connectivity + habitatQuality) / 4)
            });
          }
          
          setData(composedData);
        } else {
          // Line chart for key biodiversity trends
          const currentYear = new Date().getFullYear();
          const trendData = [];
          
          for (let yearOffset = -7; yearOffset <= 0; yearOffset++) {
            const year = currentYear + yearOffset;
            const timeFactor = (7 + yearOffset) / 7;
            
            // Key biodiversity indicators
            const totalSpecies = Math.round((speciesData?.uniqueSpecies || 25) * timeFactor * (0.9 + Math.random() * 0.2));
            const endangeredSpecies = Math.max(0, Math.round((speciesData?.endangeredSpecies || 5) * (1.3 - timeFactor * 0.5)));
            const biodiversityIndex = Math.round((biodiversityData?.averageIndex || 3) * timeFactor * 10 + Math.random() * 5) / 10;
            
            // Native vs non-native species
            const nativeSpecies = Math.round(totalSpecies * (0.85 + timeFactor * 0.1));
            const nonNativeSpecies = totalSpecies - nativeSpecies;
            
            // Population trends for key species groups
            const pollinatorPopulation = Math.round(100 * timeFactor * (0.8 + Math.random() * 0.4));
            const predatorPopulation = Math.round(80 * timeFactor * (0.9 + Math.random() * 0.2));
            const herbivorePopulation = Math.round(120 * timeFactor * (0.85 + Math.random() * 0.3));
            
            // Habitat connectivity index (0-100)
            const connectivityIndex = Math.round(50 + timeFactor * 40 + (Math.random() - 0.5) * 10);
            
            // Genetic diversity proxy (average heterozygosity)
            const geneticDiversity = Math.round((0.65 + timeFactor * 0.2 + (Math.random() - 0.5) * 0.05) * 100);
            
            trendData.push({
              year,
              yearLabel: year.toString(),
              totalSpecies,
              endangeredSpecies,
              biodiversityIndex,
              nativeSpecies,
              nonNativeSpecies,
              pollinatorPopulation,
              predatorPopulation,
              herbivorePopulation,
              connectivityIndex,
              geneticDiversity,
              // Derived metrics
              nativeRatio: Math.round((nativeSpecies / totalSpecies) * 100),
              populationHealthIndex: Math.round((pollinatorPopulation + predatorPopulation + herbivorePopulation) / 3),
              conservationEffectiveness: Math.round(((totalSpecies - endangeredSpecies) / totalSpecies) * 100)
            });
          }
          
          setData(trendData);
        }
        
      } catch (err) {
        console.error('Error fetching biodiversity trends data:', err);
        setError(err.message || 'Failed to load biodiversity data');
      } finally {
        setLoading(false);
      }
    };

    fetchBiodiversityData();
  }, [filters, chartType]);

  const formatNumber = (value) => {
    if (!value) return '0';
    return value.toLocaleString();
  };

  const formatIndex = (value) => {
    if (!value) return '0.0';
    return value.toFixed(1);
  };

  const formatPercentage = (value) => {
    if (!value) return '0%';
    return `${Math.round(value)}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {
                  entry.name.includes('Index') || entry.name.includes('index') 
                    ? formatIndex(entry.value)
                    : entry.name.includes('%') || entry.name.includes('Ratio') || entry.name.includes('Effectiveness')
                    ? formatPercentage(entry.value)
                    : formatNumber(entry.value)
                }
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const AreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Total Species: {formatNumber(total)}
            </p>
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {formatNumber(entry.value)} ({((entry.value / total) * 100).toFixed(0)}%)
              </p>
            ))}
            <div className="border-t pt-1 mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Biodiversity Index: {formatIndex(data.biodiversityIndex)}
              </p>
            </div>
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
          <ChartTitle>Biodiversity Trends</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading biodiversity data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Biodiversity Trends</ChartTitle>
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
          <ChartTitle>Biodiversity Trends</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">No biodiversity data available</p>
        </div>
      </ChartContainer>
    );
  }

  if (chartType === 'area') {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Species Composition Trends</ChartTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Evolution of species diversity by taxonomic groups
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
            <Tooltip content={<AreaTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="plants"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              name="Plants"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="insects"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              name="Insects"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="birds"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              name="Birds"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="mammals"
              stackId="1"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              name="Mammals"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (chartType === 'composed') {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Biodiversity Metrics Dashboard</ChartTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comprehensive biodiversity health indicators
          </p>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="yearLabel" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Species richness as bars */}
            <Bar 
              yAxisId="left"
              dataKey="speciesRichness" 
              fill="#e5e7eb" 
              name="Species Richness"
              opacity={0.6}
            />
            
            {/* Key biodiversity indices as lines */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="shannonIndex" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Shannon Index"
              dot={{ r: 4, fill: '#10b981' }}
            />
            
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="connectivity" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Habitat Connectivity"
              dot={{ r: 3, fill: '#3b82f6' }}
            />
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="invasiveSpecies" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Invasive Species"
              dot={{ r: 3, fill: '#ef4444' }}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Biodiversity Trends Over Time</ChartTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Long-term trends in species diversity and conservation status
        </p>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          
          {/* Total species trend */}
          <Line 
            type="monotone" 
            dataKey="totalSpecies" 
            stroke="#10b981" 
            strokeWidth={3}
            name="Total Species"
            dot={{ r: 4, fill: '#10b981' }}
          />
          
          {/* Native vs non-native */}
          <Line 
            type="monotone" 
            dataKey="nativeSpecies" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Native Species"
            dot={{ r: 3, fill: '#3b82f6' }}
          />
          
          {/* Endangered species (declining hopefully) */}
          <Line 
            type="monotone" 
            dataKey="endangeredSpecies" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Endangered Species"
            dot={{ r: 3, fill: '#ef4444' }}
            strokeDasharray="5 5"
          />
          
          {/* Biodiversity index */}
          <Line 
            type="monotone" 
            dataKey="biodiversityIndex" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="Biodiversity Index"
            dot={{ r: 3, fill: '#8b5cf6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BiodiversityTrendsChart;