import L from 'leaflet';
import { CLUSTER_SIZES, CLUSTER_ICON_CONFIG } from '@/constants/mapConstants';

export const createClusterIcon = (count) => {
  const sizeCategory = getClusterSizeCategory(count);
  const { dimension, fontSize } = CLUSTER_SIZES[sizeCategory];
  const { backgroundColor, className, iconSize } = CLUSTER_ICON_CONFIG;
  
  return L.divIcon({
    html: getClusterIconHTML(backgroundColor, dimension, fontSize, count),
    className,
    iconSize
  });
};

const getClusterSizeCategory = (count) => {
  if (count > CLUSTER_SIZES.large.threshold) return 'large';
  if (count > CLUSTER_SIZES.medium.threshold) return 'medium';
  return 'small';
};

const getClusterIconHTML = (backgroundColor, dimension, fontSize, count) => `
  <div style="
    background: ${backgroundColor};
    border: 3px solid white;
    border-radius: 50%;
    width: ${dimension};
    height: ${dimension};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: ${fontSize};
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  ">${count}</div>
`;

export default { createClusterIcon };