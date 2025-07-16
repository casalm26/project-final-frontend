import { useEffect, useState } from 'react';

export const useToastTimer = (duration) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration]);

  return progress;
};