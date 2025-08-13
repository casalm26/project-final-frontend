export const EnhancedStatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle,
  trend,
  trendDirection,
  color = 'green',
  size = 'normal'
}) => {
  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
  };

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const sizeClasses = {
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const getTrendIcon = () => {
    if (!trendDirection) return null;
    
    const iconClasses = `w-4 h-4 ${trendColors[trendDirection]}`;
    
    switch (trendDirection) {
      case 'up':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'down':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      case 'neutral':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 ${sizeClasses[size]} rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1">
          <div className={`p-2 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
            {trend && trendDirection && (
              <div className="flex items-center mt-2">
                {getTrendIcon()}
                <span className={`text-sm ml-1 ${trendColors[trendDirection]}`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStatCard;