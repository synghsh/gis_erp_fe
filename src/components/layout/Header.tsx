import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, User, Settings as SettingsIcon, Menu } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import ThemeToggle from './ThemeToggle';
import Breadcrumb from '../Breadcrumb';
import type { BreadcrumbItem } from '../Breadcrumb';
import type { RootState } from '../../store';
import './Layout.css';

export interface HeaderProps {
  onMenuToggle: () => void;
  breadcrumbItems?: BreadcrumbItem[];
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, breadcrumbItems = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const activeMenu = useSelector((state: RootState) => state.sidebar.activeMenu);
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Derive dynamic page title from active path
  const getPageTitle = () => {
    if (activeMenu === '/dashboard') return 'System Dashboard';
    if (activeMenu === '/master/state') return 'State Master';
    if (activeMenu === '/master/district') return 'District Master';
    if (activeMenu === '/master/block') return 'Block Master';
    if (activeMenu === '/master/designation') return 'Designation Master';
    if (activeMenu === '/master/role') return 'Role Master';
    if (activeMenu === '/users/details') return 'User Directory';
    if (activeMenu === '/users/assign') return 'Assign Roles';
    if (activeMenu === '/reports') return 'Analytics Reports';
    if (activeMenu === '/settings') return 'Global Settings';
    return 'ERP Portal';
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Toggle mobile sidebar trigger */}
        <button
          type="button"
          className="header-action-btn"
          style={{ display: 'none' }}
          onClick={onMenuToggle}
          id="mobile-sidebar-toggle"
        >
          <Menu size={20} />
        </button>

        {/* Page Title & Breadcrumb */}
        <div className="header-title-container">
          <h1 className="header-page-title" style={{ fontSize: '1.1rem', margin: 0, letterSpacing: 'normal' }}>
            {getPageTitle()}
          </h1>
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="header-search">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search records..."
            className="header-search-input"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Icon */}
        <button type="button" className="header-action-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>

        {/* User Profile Menu */}
        <div className="header-user-menu" ref={dropdownRef}>
          <button
            type="button"
            className="user-profile-trigger"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            aria-label="User Profile"
          >
            <div className="user-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <div className="user-info" style={{ display: 'none' }}>
              <span className="user-name">{user?.name || 'Administrator'}</span>
              <span className="user-role">{user?.roleName || 'System Admin'}</span>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {user?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  {user?.email || 'admin@gis-erp.com'}
                </div>
              </div>
              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() => navigate('/settings')}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() => navigate('/settings')}
              >
                <SettingsIcon size={16} />
                <span>Settings</span>
              </button>
              <button
                type="button"
                className="profile-dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
