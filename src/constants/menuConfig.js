export const menuConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Master Data',
    key: 'master-data',
    icon: 'Database',
    children: [
      {
        title: 'State Master',
        path: '/master/state',
        icon: 'MapPin',
      },
      {
        title: 'District Master',
        path: '/master/district',
        icon: 'Map',
      },
      {
        title: 'Block Master',
        path: '/master/block',
        icon: 'Compass',
      },
      {
        title: 'Designation Master',
        path: '/master/designation',
        icon: 'UserCheck',
      },
      {
        title: 'Role Master',
        path: '/master/role',
        icon: 'ShieldAlert',
      },
    ],
  },
  {
    title: 'User Management',
    key: 'user-management',
    icon: 'Users',
    children: [
      {
        title: 'User Details',
        path: '/users/details',
        icon: 'User',
      },
      {
        title: 'Assign Role',
        path: '/users/assign',
        icon: 'ShieldCheck',
      },
    ],
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: 'FileText',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: 'Settings',
  },
];

export default menuConfig;
