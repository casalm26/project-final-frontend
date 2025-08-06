import { useState, useEffect } from 'react';
import { useTreeStore, useFiltersStore } from '../../lib/stores';
import { TreeFormModal } from './TreeFormModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { SearchInput } from '../ui/FormElements';

export const TreeManagement = () => {
  const {
    trees,
    loading,
    error,
    pagination,
    selectedTree,
    fetchTrees,
    deleteTree,
    setSelectedTree
  } = useTreeStore();
  
  const { setSearchFilter } = useFiltersStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const loadTrees = async (searchQuery = '', currentPage = 1) => {
    try {
      await fetchTrees({
        page: currentPage,
        limit: 10,
        search: searchQuery
      });
    } catch (error) {
      console.error('Failed to load trees:', error);
    }
  };

  useEffect(() => {
    loadTrees(searchTerm, pagination.page);
  }, [searchTerm, pagination.page]);

  const handleCreateTree = () => {
    setSelectedTree(null);
    setIsFormModalOpen(true);
  };

  const handleEditTree = (tree) => {
    setSelectedTree(tree);
    setIsFormModalOpen(true);
  };

  const handleDeleteTree = async (treeId) => {
    if (!window.confirm('Are you sure you want to delete this tree?')) {
      return;
    }

    try {
      await deleteTree(treeId);
      // Data will be automatically updated in the store
    } catch (error) {
      console.error('Failed to delete tree:', error);
      alert('Failed to delete tree. Please try again.');
    }
  };

  const handleFormSuccess = () => {
    // Refresh the trees data after successful form submission
    loadTrees(searchTerm, pagination.page);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchFilter(value);
    // Reset to first page when searching
    loadTrees(value, 1);
  };

  if (loading && trees.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner text="Loading trees..." />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tree Management
          </h3>
          <button
            onClick={handleCreateTree}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Tree
          </button>
        </div>
        
        <SearchInput
          type="text"
          placeholder="Search trees by ID or species..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tree ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Species
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Forest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {trees.map((tree) => (
              <tr key={tree._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {tree.treeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {tree.species}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {tree.forestId?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {tree.location?.coordinates 
                    ? `${tree.location.coordinates[1].toFixed(4)}, ${tree.location.coordinates[0].toFixed(4)}`
                    : 'No location'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    tree.isAlive 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {tree.isAlive ? 'Alive' : 'Dead'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTree(tree)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTree(tree._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trees.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchTerm ? 'No trees found matching your search.' : 'No trees found.'}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => loadTrees(searchTerm, Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => loadTrees(searchTerm, Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <TreeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        tree={selectedTree}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};