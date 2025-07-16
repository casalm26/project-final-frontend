import L from 'leaflet';
import { TREE_HEALTH_COLORS, TREE_ICON_CONFIG } from '@/constants/mapConstants';

export const createTreeIcon = (healthType = 'healthy') => {
  const color = TREE_HEALTH_COLORS[healthType] || TREE_HEALTH_COLORS.healthy;
  const { size, emoji, className } = TREE_ICON_CONFIG;
  
  return L.divIcon({
    className,
    html: getTreeIconHTML(color, size, emoji),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const getTreeIconHTML = (color, size, emoji) => `
  <div style="
    width: ${size}px;
    height: ${size}px;
    background-color: ${color};
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    font-weight: bold;
  ">
    ${emoji}
  </div>
`;

export default { createTreeIcon };