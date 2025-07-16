export const StatsGrid = () => {
  const stats = [
    { value: "10K+", label: "Trees Monitored" },
    { value: "95%", label: "Survival Rate" },
    { value: "50+", label: "Forest Projects" },
    { value: "24/7", label: "Real-Time Data" }
  ];

  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};