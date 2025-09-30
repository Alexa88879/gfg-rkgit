import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)')?.matches);
    }
    return false;
  });

  const navigationItems = [
    { label: 'Home', path: '/', icon: 'Home', tooltip: 'Community Hub' },
    { label: 'Events', path: '/register', icon: 'Calendar', tooltip: 'Event Registration' },
    { label: 'Feedback', path: '/feedback', icon: 'MessageSquare', tooltip: 'Share Feedback' },
    { label: 'Career', path: '/career', icon: 'Users', tooltip: 'Join Us' },
    { label: 'Contact', path: '/contact', icon: 'Mail', tooltip: 'Get in Touch' }
  ];

  useEffect(() => {
    // Set active section based on current route
    const currentPath = window.location.pathname;
    
    switch (currentPath) {
      case '/':
      case '/home':
        setActiveSection('home');
        break;
      case '/register':
        setActiveSection('events');
        break;
      case '/feedback':
        setActiveSection('feedback');
        break;
      case '/career':
      case '/career-application':
        setActiveSection('career');
        break;
      case '/contact':
        setActiveSection('contact');
        break;
      default:
        // Check if current path starts with /register/ (for specific event pages)
        if (currentPath.startsWith('/register/')) {
          setActiveSection('events');
        } else {
          setActiveSection('home');
        }
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement?.classList?.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement?.classList?.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleNavClick = (path) => {
    // Handle route navigation
    window.location.href = path;
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism bg-background/90 border-b border-border transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img
                src="/favicon.jpg"
                alt="GFG RKGIT Logo"
                width="40"
                height="40"
                className="rounded-lg transition-smooth"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">
                GFG RKGIT
              </h1>
            
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.label}
                onClick={() => handleNavClick(item?.path)}
                className={`
                  relative px-4 py-2 rounded-md text-sm font-medium transition-quick
                  ${activeSection === item?.label?.toLowerCase()
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <span className="flex items-center space-x-2">
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </span>
                {activeSection === item?.label?.toLowerCase() && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Admin Login Button */}
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-quick"
              title="Admin Login"
            >
              <Icon name="Shield" size={16} />
              <span className="text-sm">Admin</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-quick"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <Icon 
                name={isDarkMode ? 'Sun' : 'Moon'} 
                size={20} 
              />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-quick"
              title="Toggle Menu"
            >
              <Icon 
                name={isMenuOpen ? 'X' : 'Menu'} 
                size={20} 
              />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <div className="px-4 py-2 space-y-1 bg-background/95 backdrop-blur-md">
            {navigationItems?.map((item) => (
              <button
                key={item?.label}
                onClick={() => handleNavClick(item?.path)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-quick
                  ${activeSection === item?.label?.toLowerCase()
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
                {activeSection === item?.label?.toLowerCase() && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            ))}
            
            {/* Admin Login - Mobile */}
            <button
              onClick={() => {
                window.location.href = '/admin/login';
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-quick text-muted-foreground hover:text-foreground hover:bg-muted border-t border-border mt-2 pt-4"
            >
              <Icon name="Shield" size={18} />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;