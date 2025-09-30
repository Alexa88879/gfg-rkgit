import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FeedbackViewer from './components/FeedbackViewer';
import ApplicationsViewer from './components/ApplicationsViewer';
import AnalyticsViewer from './components/AnalyticsViewer';
import UserManagement from './components/UserManagement';
import BackupManager from './components/BackupManager';
import ExportHistoryViewer from './components/ExportHistoryViewer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)')?.matches);
    }
    return false;
  });
  const { adminUser, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, navigate]);

  // Handle authentication errors
  useEffect(() => {
    if (adminUser && !adminUser.isActive) {
      console.error('Admin user is not active');
      navigate('/admin/login');
    }
  }, [adminUser, navigate]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement?.classList?.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement?.classList?.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Navigation items based on permissions
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'BarChart3',
      permission: null // Always visible
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: 'MessageSquare',
      permission: 'canViewFeedback'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: 'Users',
      permission: 'canViewApplications'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'TrendingUp',
      permission: 'canViewAnalytics'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'UserCog',
      permission: 'canManageUsers'
    },
    {
      id: 'backup',
      label: 'Backup Manager',
      icon: 'Database',
      permission: 'canBackupData'
    },
    {
      id: 'export-history',
      label: 'Export History',
      icon: 'History',
      permission: 'canManageUsers'
    }
  ].filter(item => !item.permission || hasPermission(item.permission));

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AnalyticsViewer />;
      case 'feedback':
        return <FeedbackViewer />;
      case 'applications':
        return <ApplicationsViewer />;
      case 'analytics':
        return <AnalyticsViewer />;
      case 'users':
        return <UserManagement />;
      case 'backup':
        return <BackupManager />;
      case 'export-history':
        return <ExportHistoryViewer />;
      default:
        return <AnalyticsViewer />;
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name={sidebarOpen ? 'X' : 'Menu'} size={20} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
                  <p className="text-xs text-muted-foreground">GFG RKGIT Portal</p>
                </div>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{adminUser.displayName || adminUser.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{adminUser.role.replace('_', ' ')}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <Icon 
                  name={isDarkMode ? 'Sun' : 'Moon'} 
                  size={20} 
                />
              </button>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                iconName="LogOut"
                iconPosition="left"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full pt-16 lg:pt-0">
            <nav className="px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth
                    ${activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p className="leading-tight">GFG RKGIT Admin Portal</p>
                <p className="leading-tight">Version 1.0.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
