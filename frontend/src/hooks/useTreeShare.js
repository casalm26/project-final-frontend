import { useCallback } from 'react';

export const useTreeShare = (tree) => {
  const handleShare = useCallback(() => {
    if (!tree) return;
    
    if (navigator.share) {
      navigator.share({
        title: `Tree Details - ${tree.name}`,
        text: `Check out this tree: ${tree.name} (${tree.species})`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tree URL copied to clipboard!');
    }
  }, [tree]);

  return handleShare;
};