import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { ADMIN_ROLES } from '../../../contexts/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: ADMIN_ROLES.SUPER_ADMIN, label: 'Super Admin' },
    { value: ADMIN_ROLES.ADMIN, label: 'Admin' },
    { value: ADMIN_ROLES.MODERATOR, label: 'Moderator' },
    { value: ADMIN_ROLES.VIEWER, label: 'Viewer' }
  ];

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'admin-users'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const usersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUsers(usersData);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching users:', error);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });


  // Handle update user
  const handleUpdateUser = async (userId, userData) => {
    try {
      await updateDoc(doc(db, 'admin-users', userId), {
        ...userData,
        updatedAt: new Date().toISOString()
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Find the user to get their UID
        const user = users.find(u => u.id === userId);
        
        // Delete Firestore document first
        await deleteDoc(doc(db, 'admin-users', userId));
        
        // Note: Firebase Auth user deletion requires admin privileges
        // For now, we'll only delete the Firestore document
        // The Auth user will remain but won't have admin access
        alert('User deleted successfully! Note: Firebase Auth user may still exist but without admin access.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Error deleting user: ${error.message}`);
      }
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'admin-users', userId), {
        isActive: !currentStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === null || dateString === 'null') return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case ADMIN_ROLES.SUPER_ADMIN:
        return 'bg-error/10 text-error';
      case ADMIN_ROLES.ADMIN:
        return 'bg-primary/10 text-primary';
      case ADMIN_ROLES.MODERATOR:
        return 'bg-warning/10 text-warning';
      case ADMIN_ROLES.VIEWER:
        return 'bg-muted/10 text-muted-foreground';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no users
  if (users.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            <p className="text-muted-foreground">Manage admin users and permissions</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Users Found</h3>
          <p className="text-muted-foreground">
            No admin users found. User accounts are managed by the system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>
        
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Search Users"
            placeholder="Search by email or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconName="Search"
          />
          
          <Select
            label="Filter by Role"
            options={roleOptions}
            value={filterRole}
            onChange={setFilterRole}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Last Login</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{user.displayName || 'No Name'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        title="Edit User"
                        onClick={() => setEditingUser(user)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={user.isActive ? 'UserX' : 'UserCheck'}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        title="Delete User"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-error hover:text-error"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Edit User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdateUser(editingUser.id, {
                displayName: formData.get('displayName'),
                role: formData.get('role'),
                isActive: formData.get('isActive') === 'on'
              });
            }} className="space-y-4">
              <Input
                label="Email"
                value={editingUser.email}
                disabled
                className="bg-muted"
              />
              <Input
                label="Display Name"
                name="displayName"
                defaultValue={editingUser.displayName}
                required
                placeholder="John Doe"
              />
              <Select
                label="Role"
                name="role"
                options={roleOptions.filter(opt => opt.value !== '')}
                value={editingUser.role}
                onChange={(value) => setEditingUser({...editingUser, role: value})}
                required
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingUser.isActive}
                  className="rounded border-border"
                />
                <label className="text-sm text-foreground">Active User</label>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Button type="submit" variant="default" size="sm">
                  Update User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
