import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Icons from 'lucide-react';
import { ChevronDown, Menu, Globe, ChevronLeft } from 'lucide-react';
import { toggleSidebar, setActiveMenu, toggleSubmenu } from '../../store/slices/sidebarSlice';
import menuConfig from '../../constants/menuConfig';
import './Layout.css';

export const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const activeMenu = useSelector((state) => state.sidebar.activeMenu);
  const openMenus = useSelector((state) => state.sidebar.openMenus);

  // Sync active menu with current path
  React.useEffect(() => {
    dispatch(setActiveMenu(location.pathname));
  }, [location.pathname, dispatch]);

  const renderIcon = (iconName) => {
    const LucideIcon = Icons[iconName];
    return LucideIcon ? <LucideIcon size={20} /> : <Icons.HelpCircle size={20} />;
  };

  const handleMenuClick = (item) => {
    if (item.children) {
      dispatch(toggleSubmenu(item.key));
    } else {
      dispatch(setActiveMenu(item.path));
      navigate(item.path);
      if (toggleMobileSidebar) toggleMobileSidebar(false);
    }
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Globe size={18} />
        </div>
        <span className="brand-name">GIS ERP</span>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        {menuConfig.map((item) => {
          const hasChildren = !!item.children;
          const isOpen = openMenus.includes(item.key);
          const isItemActive = hasChildren
            ? item.children.some((child) => child.path === activeMenu)
            : item.path === activeMenu;

          return (
            <div key={item.path || item.key} className="menu-item-wrapper">
              <div
                className={`menu-item-link ${isItemActive ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                <div className="menu-item-left">
                  <span className="menu-icon">{renderIcon(item.icon)}</span>
                  {!isCollapsed && <span className="menu-text">{item.title}</span>}
                </div>
                {hasChildren && !isCollapsed && (
                  <ChevronDown
                    size={16}
                    className={`chevron-icon ${isOpen ? 'open' : ''}`}
                  />
                )}
              </div>

              {/* Submenu rendering */}
              {hasChildren && isOpen && !isCollapsed && (
                <div className="tree-submenu">
                  {item.children.map((child) => {
                    const isChildActive = child.path === activeMenu;
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`submenu-item-link ${isChildActive ? 'active' : ''}`}
                        onClick={() => {
                          dispatch(setActiveMenu(child.path));
                          if (toggleMobileSidebar) toggleMobileSidebar(false);
                        }}
                      >
                        <span className="menu-icon" style={{ width: '16px' }}>
                          {renderIcon(child.icon)}
                        </span>
                        <span>{child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse button footer */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <Icons.ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
