import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  Clock,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Map,
  Activity,
  UserPlus,
  RefreshCw,
  Plus
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/Card';
import Chips from '../../components/Chips';
import './Dashboard.css';

const breadcrumbs = [{ label: 'Dashboard' }];

export const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  // Framer Motion presets
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', damping: 20 } },
  };

  const stats = [
    {
      label: 'Active Surveyors',
      value: '12',
      trend: '+12.4%',
      trendUp: true,
      icon: Users,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'Mapped Coordinates',
      value: '4,820',
      trend: '+8.2%',
      trendUp: true,
      icon: MapPin,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.1)',
    },
    {
      label: 'Pending Approvals',
      value: '14',
      trend: '-4.1%',
      trendUp: false,
      icon: Clock,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Active Roles',
      value: '5',
      trend: 'Stable',
      trendUp: true,
      icon: Shield,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  const progressMeters = [
    { label: 'GIS Layer Mapping Coverage', value: 85, color: 'var(--primary-color)' },
    { label: 'Database Coordinates Synchronization', value: 92, color: 'var(--info-color)' },
    { label: 'Server API Uptime status', value: 99, color: 'var(--success-color)' },
  ];

  const recentLogs = [
    {
      id: 1,
      text: 'Surveyor <strong>Neha Singha</strong> logged 48 coordinates in Jorhat, Assam.',
      time: '12 mins ago',
      icon: MapPin,
      type: 'success',
    },
    {
      id: 2,
      text: 'Role <strong>GIS Surveyor</strong> assigned to Amit Sharma.',
      time: '45 mins ago',
      icon: UserPlus,
      type: 'info',
    },
    {
      id: 3,
      text: 'System coordinator synced <strong>Meghalaya District Master</strong> configurations.',
      time: '2 hours ago',
      icon: RefreshCw,
      type: 'warning',
    },
    {
      id: 4,
      text: 'State Master entry <strong>Nagaland (NL)</strong> created successfully.',
      time: '4 hours ago',
      icon: Plus,
      type: 'success',
    },
  ];

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Welcome Block */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Hello, {user?.name || 'Sayan Ghosh'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Here is what is happening across your GIS-ERP nodes today.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="dashboard-container"
      >
        {/* KPI Row */}
        <div className="dashboard-grid">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="kpi-card" hoverable>
                  <div
                    className="kpi-icon-wrapper"
                    style={{ backgroundColor: stat.bg, color: stat.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-value">{stat.value}</span>
                    <span className="kpi-label">{stat.label}</span>
                    <span className={`kpi-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}`}>
                      {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.trend}
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Double Column content */}
        <div className="dashboard-columns">
          {/* Col 1: System stats */}
          <motion.div variants={itemVariants}>
            <Card title="Geospatial Operations Status" hoverable={false} style={{ height: '100%' }}>
              <div className="progress-list">
                {progressMeters.map((meter, index) => (
                  <div key={index} className="progress-item">
                    <div className="progress-header">
                      <span>{meter.label}</span>
                      <span>{meter.value}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <motion.div
                        className="progress-bar-fill"
                        style={{ backgroundColor: meter.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${meter.value}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Radial SVGs rings */}
              <div className="circle-chart-container">
                <div className="circle-chart-item">
                  <svg width="100" height="100" className="circle-svg">
                    <circle cx="50" cy="50" r="40" className="circle-svg-bg" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      className="circle-svg-fill"
                      stroke="var(--primary-color)"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * 75) / 100 }}
                      transition={{ duration: 1.2 }}
                    />
                  </svg>
                  <span className="circle-chart-label">Map Layer Accuracy</span>
                </div>

                <div className="circle-chart-item">
                  <svg width="100" height="100" className="circle-svg">
                    <circle cx="50" cy="50" r="40" className="circle-svg-bg" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      className="circle-svg-fill"
                      stroke="var(--info-color)"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * 94) / 100 }}
                      transition={{ duration: 1.2 }}
                    />
                  </svg>
                  <span className="circle-chart-label">Data Verification</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Col 2: Activity logs */}
          <motion.div variants={itemVariants}>
            <Card
              title="Recent Activity Logs"
              extra={<Chips type="info">Realtime Feed</Chips>}
              hoverable={false}
              style={{ height: '100%' }}
            >
              <div className="activity-feed">
                {recentLogs.map((log) => {
                  const LogIcon = log.icon;
                  return (
                    <div key={log.id} className="activity-item">
                      <div className="activity-icon">
                        <LogIcon size={16} />
                      </div>
                      <div className="activity-details">
                        <span
                          className="activity-text"
                          dangerouslySetInnerHTML={{ __html: log.text }}
                        />
                        <span className="activity-time">{log.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default DashboardPage;
