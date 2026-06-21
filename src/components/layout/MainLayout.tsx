import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import { removeToast } from '../../store/slices/globalSlice';
import type { BreadcrumbItem } from '../Breadcrumb';
import type { RootState } from '../../store';
import './Layout.css';

export interface MainLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, breadcrumbItems = [] }) => {
  const dispatch = useDispatch();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toasts = useSelector((state: RootState) => state.global.toasts);

  const getToastIcon = (type: 'success' | 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'success': return <CheckCircle size={20} style={{ color: 'var(--success-color)' }} />;
      case 'warning': return <AlertTriangle size={20} style={{ color: 'var(--warning-color)' }} />;
      case 'error': return <AlertCircle size={20} style={{ color: 'var(--error-color)' }} />;
      default: return <Info size={20} style={{ color: 'var(--info-color)' }} />;
    }
  };

  return (
    <div className="layout-wrapper">
      {/* Sidebar Layout */}
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        toggleMobileSidebar={setMobileSidebarOpen}
      />

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="drawer-backdrop"
          style={{ zIndex: 98 }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          onMenuToggle={() => setMobileSidebarOpen(true)}
          breadcrumbItems={breadcrumbItems}
        />
        
        {/* Scrollable Viewport */}
        <main className="page-content-viewport">
          {children}
        </main>
      </div>

      {/* Global Toast Banner Portal Overlay */}
      <div className="toast-overlay-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast-item toast-${toast.type}`}
              initial={{ transform: 'translateY(50px) scale(0.9)', opacity: 0 }}
              animate={{ transform: 'translateY(0) scale(1)', opacity: 1 }}
              exit={{ transform: 'translateY(-20px) scale(0.9)', opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              layout
            >
              {getToastIcon(toast.type)}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {toast.message}
                </span>
              </div>
              <button
                type="button"
                className="toast-close-btn"
                onClick={() => dispatch(removeToast(toast.id))}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;
