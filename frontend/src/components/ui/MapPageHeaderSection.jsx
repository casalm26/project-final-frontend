import { ExportButtonComponent } from './ExportButton';

export const MapPageHeaderSection = ({ onExportStart, onExportComplete, onExportError }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forest Map</h2>
          <p className="text-gray-600">
            Explore your forests and individual trees with interactive mapping.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ExportButtonComponent
            onExportStart={onExportStart}
            onExportComplete={onExportComplete}
            onExportError={onExportError}
          />
        </div>
      </div>
    </div>
  );
};