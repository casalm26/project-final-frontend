import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { MapLocationPicker } from '../ui/MapLocationPicker';
import { forestAPI, treeAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export const TreeFormModal = ({ 
  isOpen, 
  onClose, 
  tree = null, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [useMapPicker, setUseMapPicker] = useState(false);
  const [formData, setFormData] = useState({
    treeId: '',
    forestId: '',
    species: '',
    plantedDate: '',
    latitude: '',
    longitude: '',
    soilCondition: '',
    sunlightExposure: '',
    notes: ''
  });

  const isEditMode = !!tree;

  // Load forests on mount
  useEffect(() => {
    const loadForests = async () => {
      try {
        const response = await forestAPI.getAll();
        const forestsData = response.data?.forests || response.data || [];
        setForests(forestsData);
      } catch (error) {
        console.error('Failed to load forests:', error);
      }
    };
    
    if (isOpen) {
      loadForests();
    }
  }, [isOpen]);

  // Initialize form data when tree changes
  useEffect(() => {
    if (tree) {
      setFormData({
        treeId: tree.treeId || '',
        forestId: tree.forestId?._id || tree.forestId || '',
        species: tree.species || '',
        plantedDate: tree.plantedDate ? new Date(tree.plantedDate).toISOString().split('T')[0] : '',
        latitude: tree.location?.coordinates?.[1] || tree.lat || '',
        longitude: tree.location?.coordinates?.[0] || tree.lng || '',
        soilCondition: tree.metadata?.soilCondition || '',
        sunlightExposure: tree.metadata?.sunlightExposure || '',
        notes: tree.metadata?.notes || ''
      });
    } else {
      // Reset form for create mode
      setFormData({
        treeId: '',
        forestId: '',
        species: '',
        plantedDate: '',
        latitude: '',
        longitude: '',
        soilCondition: '',
        sunlightExposure: '',
        notes: ''
      });
    }
    setErrors({});
  }, [tree]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleLocationChange = ({ latitude, longitude }) => {
    setFormData(prev => ({
      ...prev,
      latitude,
      longitude
    }));
    
    // Clear location errors
    setErrors(prev => ({
      ...prev,
      latitude: null,
      longitude: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.treeId.trim()) {
      newErrors.treeId = 'Tree ID is required';
    }
    
    if (!formData.forestId) {
      newErrors.forestId = 'Forest is required';
    }
    
    if (!formData.species.trim()) {
      newErrors.species = 'Species is required';
    }
    
    if (!formData.plantedDate) {
      newErrors.plantedDate = 'Planted date is required';
    }
    
    if (!formData.latitude || isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = 'Valid latitude is required';
    } else {
      const lat = parseFloat(formData.latitude);
      if (lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90';
      }
    }
    
    if (!formData.longitude || isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = 'Valid longitude is required';
    } else {
      const lng = parseFloat(formData.longitude);
      if (lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const treeData = {
        treeId: formData.treeId,
        forestId: formData.forestId,
        species: formData.species,
        plantedDate: formData.plantedDate,
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
        },
        metadata: {
          soilCondition: formData.soilCondition || undefined,
          sunlightExposure: formData.sunlightExposure || undefined,
          notes: formData.notes || undefined
        }
      };

      if (isEditMode) {
        await treeAPI.update(tree._id, treeData);
      } else {
        await treeAPI.create(treeData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to save tree:', error);
      setErrors({
        submit: error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} tree`
      });
    } finally {
      setLoading(false);
    }
  };

  const sunlightOptions = [
    { value: '', label: 'Select sunlight exposure' },
    { value: 'full_sun', label: 'Full Sun' },
    { value: 'partial_sun', label: 'Partial Sun' },
    { value: 'partial_shade', label: 'Partial Shade' },
    { value: 'full_shade', label: 'Full Shade' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isEditMode ? 'Edit' : 'Create'} Tree`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tree ID"
            required
            error={errors.treeId}
          >
            <input
              type="text"
              value={formData.treeId}
              onChange={(e) => handleChange('treeId', e.target.value)}
              className="form-input"
              placeholder="e.g., TREE-001"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Forest"
            required
            error={errors.forestId}
          >
            <select
              value={formData.forestId}
              onChange={(e) => handleChange('forestId', e.target.value)}
              className="form-input"
              disabled={loading}
            >
              <option value="">Select a forest</option>
              {forests.map(forest => (
                <option key={forest._id} value={forest._id}>
                  {forest.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Species"
            required
            error={errors.species}
          >
            <input
              type="text"
              value={formData.species}
              onChange={(e) => handleChange('species', e.target.value)}
              className="form-input"
              placeholder="e.g., Pine, Oak, Birch"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Planted Date"
            required
            error={errors.plantedDate}
          >
            <input
              type="date"
              value={formData.plantedDate}
              onChange={(e) => handleChange('plantedDate', e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </FormField>
        </div>

        {/* Location Input Method Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Tree Location
          </h4>
          <button
            type="button"
            onClick={() => setUseMapPicker(!useMapPicker)}
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            disabled={loading}
          >
            {useMapPicker ? 'Use Manual Entry' : 'Use Map Picker'}
          </button>
        </div>

        {useMapPicker ? (
          <FormField
            label="Select Location on Map"
            required
            error={errors.latitude || errors.longitude}
          >
            <MapLocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
              height="400px"
            />
          </FormField>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Latitude"
              required
              error={errors.latitude}
              helpText="Between -90 and 90 degrees"
            >
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                className="form-input"
                placeholder="e.g., 59.3293"
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Longitude"
              required
              error={errors.longitude}
              helpText="Between -180 and 180 degrees"
            >
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
                className="form-input"
                placeholder="e.g., 18.0686"
                disabled={loading}
              />
            </FormField>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Soil Condition"
            error={errors.soilCondition}
          >
            <input
              type="text"
              value={formData.soilCondition}
              onChange={(e) => handleChange('soilCondition', e.target.value)}
              className="form-input"
              placeholder="e.g., Sandy, Clay, Loamy"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Sunlight Exposure"
            error={errors.sunlightExposure}
          >
            <select
              value={formData.sunlightExposure}
              onChange={(e) => handleChange('sunlightExposure', e.target.value)}
              className="form-input"
              disabled={loading}
            >
              {sunlightOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          label="Notes"
          error={errors.notes}
        >
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="form-input resize-none"
            rows="3"
            placeholder="Additional notes about the tree..."
            disabled={loading}
          />
        </FormField>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Tree' : 'Create Tree')}
          </button>
        </div>
      </form>
    </Modal>
  );
};