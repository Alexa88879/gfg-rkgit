import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

// Admin roles configuration
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
};

// Role permissions - NO DELETE PERMISSIONS FOR ANY ROLE
export const ROLE_PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: {
    canViewFeedback: true,
    canViewApplications: true,
    canExportData: true,
    canDeleteData: false, // REMOVED - No one can delete user data
    canManageUsers: true,
    canViewAnalytics: true,
    canBackupData: true
  },
  [ADMIN_ROLES.ADMIN]: {
    canViewFeedback: true,
    canViewApplications: true,
    canExportData: true,
    canDeleteData: false, // REMOVED - No one can delete user data
    canManageUsers: false,
    canViewAnalytics: true,
    canBackupData: true
  },
  [ADMIN_ROLES.MODERATOR]: {
    canViewFeedback: true,
    canViewApplications: true,
    canExportData: true,
    canDeleteData: false, // REMOVED - No one can delete user data
    canManageUsers: false,
    canViewAnalytics: true,
    canBackupData: false
  },
  [ADMIN_ROLES.VIEWER]: {
    canViewFeedback: true,
    canViewApplications: true,
    canExportData: false,
    canDeleteData: false, // REMOVED - No one can delete user data
    canManageUsers: false,
    canViewAnalytics: false,
    canBackupData: false
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);

  // Rate limiting configuration
  const MAX_LOGIN_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
  const LOGIN_ATTEMPT_WINDOW = parseInt(import.meta.env.VITE_LOGIN_ATTEMPT_WINDOW) || 900000; // 15 minutes
  const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_ADMIN_SESSION_TIMEOUT) || 1800000; // 30 minutes

  // Check if user is rate limited
  const isRateLimited = () => {
    if (!lastAttemptTime) return false;
    const now = Date.now();
    const timeDiff = now - lastAttemptTime;
    
    if (timeDiff > LOGIN_ATTEMPT_WINDOW) {
      setLoginAttempts(0);
      setLastAttemptTime(null);
      return false;
    }
    
    return loginAttempts >= MAX_LOGIN_ATTEMPTS;
  };

  // Fetch admin user data from Firestore
  const fetchAdminUser = async (user) => {
    try {
      const adminDoc = await getDoc(doc(db, 'admin-users', user.uid));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: adminData.role || ADMIN_ROLES.VIEWER,
          permissions: ROLE_PERMISSIONS[adminData.role] || ROLE_PERMISSIONS[ADMIN_ROLES.VIEWER],
          isActive: adminData.isActive !== false,
          lastLogin: new Date().toISOString(),
          createdAt: adminData.createdAt,
          updatedAt: new Date().toISOString()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      return null;
    }
  };

  // Login function with rate limiting
  const login = async (email, password) => {
    if (isRateLimited()) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const adminUserData = await fetchAdminUser(userCredential.user);
      
      if (!adminUserData) {
        await signOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }

      if (!adminUserData.isActive) {
        await signOut(auth);
        throw new Error('Account is deactivated. Contact administrator.');
      }

      setAdminUser(adminUserData);
      setLoginAttempts(0);
      setLastAttemptTime(null);
      
      // Update last login time
      await updateLastLogin(adminUserData.uid);
      
      return adminUserData;
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      setLastAttemptTime(Date.now());
      throw error;
    }
  };

  // Update last login time
  const updateLastLogin = async (uid) => {
    try {
      await updateDoc(doc(db, 'admin-users', uid), {
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      // Don't throw error as this is not critical
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAdminUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!adminUser) return false;
    return adminUser.permissions[permission] || false;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!adminUser) return false;
    return adminUser.role === role;
  };

  // Session timeout handler
  useEffect(() => {
    let timeoutId;
    
    if (adminUser) {
      timeoutId = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [adminUser]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminUserData = await fetchAdminUser(user);
        if (adminUserData && adminUserData.isActive) {
          setUser(user);
          setAdminUser(adminUserData);
        } else {
          setUser(null);
          setAdminUser(null);
          await signOut(auth);
        }
      } else {
        setUser(null);
        setAdminUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    adminUser,
    loading,
    login,
    logout,
    hasPermission,
    hasRole,
    isRateLimited,
    loginAttempts,
    MAX_LOGIN_ATTEMPTS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};