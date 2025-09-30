import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)')?.matches);
    }
    return false;
  });
  const { login, adminUser, loading, isRateLimited, loginAttempts, MAX_LOGIN_ATTEMPTS } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (adminUser) {
      navigate('/admin/dashboard');
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

  // Handle form submission
  const onSubmit = async (data) => {
    if (isRateLimited()) {
      setError('Too many login attempts. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Icon name="Loader2" size={32} className="text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <Icon 
          name={isDarkMode ? 'Sun' : 'Moon'} 
          size={20} 
        />
      </button>
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Icon name="Shield" size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Admin Login
          </h2>
          <p className="text-muted-foreground">
            Access the GFG RKGIT Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl border border-border elevation-2 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Rate Limiting Warning */}
            {isRateLimited() && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-center space-x-3">
                <Icon name="Clock" size={20} className="text-warning flex-shrink-0" />
                <div>
                  <p className="text-sm text-warning font-medium">Rate Limited</p>
                  <p className="text-xs text-warning/80">
                    {loginAttempts}/{MAX_LOGIN_ATTEMPTS} attempts used. Please wait before trying again.
                  </p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
            />

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-error">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              loading={isLoading}
              disabled={isLoading || isRateLimited()}
              fullWidth
              iconName="LogIn"
              iconPosition="left"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Secure Access</p>
                <p className="text-xs text-muted-foreground">
                  This is a secure admin area. All activities are logged and monitored.
                  Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Website */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center space-x-2 mx-auto"
          >
            <Icon name="ArrowLeft" size={16} />
            <span>Back to Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
