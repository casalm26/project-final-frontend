export const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg dark:shadow-gray-900/50">
      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
};