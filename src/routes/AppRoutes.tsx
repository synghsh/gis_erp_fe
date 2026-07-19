import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import StateMasterPage from '../features/master-data/StateMasterPage';
import DistrictMasterPage from '../features/master-data/DistrictMasterPage';
import BlockMasterPage from '../features/master-data/BlockMasterPage';
import RoleMasterPage from '../features/master-data/RoleMasterPage';
import DesignationMasterPage from '../features/master-data/DesignationMasterPage';
import ConductorMasterPage from '../features/master-data/ConductorMasterPage';
import PoleMasterPage from '../features/master-data/PoleMasterPage';
import TransformerMasterPage from '../features/master-data/TransformerMasterPage';
import UserDetailsPage from '../features/user-management/UserDetailsPage';

// Simple Stub Component for other routes
interface ComingSoonProps {
  title: string;
}

const ComingSoonPage: React.FC<ComingSoonProps> = ({ title }) => (
  <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
    <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{title} Module</h2>
    <p style={{ color: 'var(--text-muted)' }}>This section is currently under development. Stay tuned!</p>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        {/* Core Layout Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Master Data */}
        <Route path="/master/state" element={<StateMasterPage />} />
        <Route path="/master/district" element={<DistrictMasterPage />} />
        <Route path="/master/block" element={<BlockMasterPage />} />
        <Route path="/master/role" element={<RoleMasterPage />} />
        <Route path="/master/designation" element={<DesignationMasterPage />} />
        <Route path="/master/conductor" element={<ConductorMasterPage />} />
        <Route path="/master/pole" element={<PoleMasterPage />} />
        <Route path="/master/transformer" element={<TransformerMasterPage />} />
        
        {/* User Management */}
        <Route path="/users/details" element={<UserDetailsPage />} />
        <Route path="/users/assign" element={<ComingSoonPage title="Assign Roles" />} />
        
        {/* Other menu stubs */}
        <Route path="/reports" element={<ComingSoonPage title="Reports" />} />
        <Route path="/settings" element={<ComingSoonPage title="Settings" />} />

        {/* Catch-all redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
