import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AuditLogTable } from '../components/admin/AuditLogTable';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminPageLayout, AdminPageHeader, AdminPageContent } from '../components/admin/AdminPageLayout';

export const AdminPage = () => {
  const { isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminPageLayout>
      <AdminHeader />
      
      <AdminPageContent>
        <AdminPageHeader 
          title="System Administration" 
          description="Monitor system activity and user actions with comprehensive audit logging."
        />
        
        <AdminStats />
        
        <AuditLogTable />
      </AdminPageContent>
    </AdminPageLayout>
  );
}; 