import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AuditLogTable } from '../components/admin/AuditLogTable';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminStats } from '../components/admin/AdminStats';
import { TreeManagement } from '../components/admin/TreeManagement';
import { AdminPageLayout, AdminPageHeader, AdminPageContent } from '../components/admin/AdminPageLayout';

export const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('audit');

  // Redirect non-admin users
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { id: 'audit', label: 'Audit Logs' },
    { id: 'trees', label: 'Tree Management' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trees':
        return <TreeManagement />;
      case 'audit':
      default:
        return <AuditLogTable />;
    }
  };

  return (
    <AdminPageLayout>
      <AdminHeader />
      
      <AdminPageContent>
        <AdminPageHeader 
          title="System Administration" 
          description="Monitor system activity, manage trees, and view comprehensive audit logging."
        />
        
        <AdminStats />
        
        {/* Admin Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </AdminPageContent>
    </AdminPageLayout>
  );
}; 