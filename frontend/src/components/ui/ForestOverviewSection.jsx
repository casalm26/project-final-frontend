export const ForestOverviewSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Forest Overview</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Your forests are performing excellently with strong growth indicators and high survival rates.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Activity</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              New measurements recorded for Forest A
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Survival rate improved by 2.3%
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              CO₂ absorption increased by 15%
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Next Actions</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              Schedule maintenance for Forest B
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              Review growth data for Q4 report
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              Address low-performing areas in Forest C
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};