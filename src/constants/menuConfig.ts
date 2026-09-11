export interface MenuItem {
  title: string;
  path?: string;
  key?: string;
  icon: string;
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
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
      {
        title: 'Conductor Master',
        path: '/master/conductor',
        icon: 'Activity',
      },
      {
        title: 'Pole Master',
        path: '/master/pole',
        icon: 'Server',
      },
      {
        title: 'Transformer Master',
        path: '/master/transformer',
        icon: 'Zap',
      },
    ],
  },
  {
    title: 'Work Details',
    key: 'work-details',
    icon: 'Briefcase',
    children: [
      {
        title: 'Erection Work',
        path: '/work-details/erection',
        icon: 'Hammer',
      },
      {
        title: 'Survey Work',
        path: '/work-details/survey',
        icon: 'Compass',
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
