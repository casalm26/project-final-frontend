import { useEffect, useState } from 'react';

export const ColdStartLoader = ({ 
  connectionState, 
  onCancel, 
  showCancel = true 
}) => {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const { 
    isConnecting, 
    isColdStart, 
    retryAttempt, 
    totalAttempts, 
    estimatedWaitTime, 
    message 
  } = connectionState;

  // Progress bar animation
  useEffect(() => {
    if (!isConnecting) {
      setProgress(0);
      setTimeElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      
      if (isColdStart) {
        // For cold starts, show more realistic progress
        const maxTime = 60; // 60 seconds max expected time
        const currentProgress = Math.min((timeElapsed / maxTime) * 100, 90);
        setProgress(currentProgress);
      } else {
        // For normal connections, show faster progress
        const maxTime = 10;
        const currentProgress = Math.min((timeElapsed / maxTime) * 100, 90);
        setProgress(currentProgress);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnecting, isColdStart, timeElapsed]);

  // Complete progress on success
  useEffect(() => {
    if (!isConnecting && progress > 0) {
      setProgress(100);
    }
  }, [isConnecting, progress]);

  if (!isConnecting) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isColdStart ? 'Server Starting Up' : 'Connecting'}
          </h3>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-2">{message}</p>
          
          {isColdStart && (
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>The server needs to start up from sleep mode.</p>
              <p>This usually takes 30-60 seconds.</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Retry Info */}
        {retryAttempt > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600 dark:text-blue-400">
                Attempt {retryAttempt} of {totalAttempts}
              </span>
              <span className="text-blue-500 dark:text-blue-300">
                {timeElapsed}s elapsed
              </span>
            </div>
          </div>
        )}

        {/* Estimated Time */}
        {estimatedWaitTime > 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            Estimated wait time: {estimatedWaitTime} seconds
          </div>
        )}

        {/* Cancel Button */}
        {showCancel && onCancel && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm underline"
            >
              Cancel and try again later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdStartLoader;