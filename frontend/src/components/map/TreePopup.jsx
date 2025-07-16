import { TREE_HEALTH_STYLES } from '@/constants/mapConstants';

export const getTreePopupContent = (tree) => {
  const healthStyle = TREE_HEALTH_STYLES[tree.health] || TREE_HEALTH_STYLES.healthy;
  
  return getPopupHTML(tree, healthStyle);
};

const getPopupHTML = (tree, healthStyle) => `
  <div style="padding: 8px;">
    <h4 style="margin: 0 0 8px 0; font-weight: 600;">${tree.name}</h4>
    <p style="margin: 4px 0; font-size: 14px;">Species: ${tree.species}</p>
    <p style="margin: 4px 0; font-size: 14px;">Height: ${tree.height}m</p>
    <p style="margin: 4px 0; font-size: 14px;">Health: 
      <span style="padding: 2px 8px; border-radius: 12px; font-size: 12px; ${healthStyle}">${tree.health}</span>
    </p>
  </div>
`;

export const TreePopupContent = ({ tree }) => {
  const healthStyle = TREE_HEALTH_STYLES[tree.health] || TREE_HEALTH_STYLES.healthy;
  
  return (
    <div style={{ padding: '8px' }}>
      <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{tree.name}</h4>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Species: {tree.species}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Height: {tree.height}m</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>
        Health: 
        <span style={{ 
          padding: '2px 8px', 
          borderRadius: '12px', 
          fontSize: '12px',
          ...parseStyleString(healthStyle)
        }}>
          {tree.health}
        </span>
      </p>
    </div>
  );
};

const parseStyleString = (styleString) => {
  const styles = {};
  styleString.split(';').forEach(style => {
    const [property, value] = style.split(':').map(s => s.trim());
    if (property && value) {
      const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelCaseProperty] = value;
    }
  });
  return styles;
};

export default { getTreePopupContent, TreePopupContent };