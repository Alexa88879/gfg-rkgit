import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BackupManager = () => {
  const [loading, setLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState('');
  const [backupHistory, setBackupHistory] = useState([]);

  // Fetch backup history
  useEffect(() => {
    const fetchBackupHistory = async () => {
      try {
        // In a real implementation, you would fetch from a backup collection
        // For now, we'll simulate with localStorage
        const history = JSON.parse(localStorage.getItem('backupHistory') || '[]');
        setBackupHistory(history);
      } catch (error) {
        console.error('Error fetching backup history:', error);
      }
    };

    fetchBackupHistory();
  }, []);

  // Create backup
  const handleCreateBackup = async () => {
    setLoading(true);
    setBackupStatus('Creating backup...');

    try {
      // Fetch all data
      const feedbackQuery = query(collection(db, 'feedback'));
      const applicationsQuery = query(collection(db, 'career-applications'));
      const usersQuery = query(collection(db, 'admin-users'));

      const [feedbackSnapshot, applicationsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(feedbackQuery),
        getDocs(applicationsQuery),
        getDocs(usersQuery)
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        feedback: feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        applications: applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        users: usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        metadata: {
          totalFeedback: feedbackSnapshot.size,
          totalApplications: applicationsSnapshot.size,
          totalUsers: usersSnapshot.size,
          version: '1.0.0'
        }
      };

      // Save backup to localStorage (in production, save to cloud storage)
      const backupId = `backup_${Date.now()}`;
      localStorage.setItem(`backup_${backupId}`, JSON.stringify(backupData));

      // Update backup history
      const newHistory = [
        {
          id: backupId,
          timestamp: backupData.timestamp,
          size: JSON.stringify(backupData).length,
          metadata: backupData.metadata
        },
        ...backupHistory
      ].slice(0, 10); // Keep only last 10 backups

      setBackupHistory(newHistory);
      localStorage.setItem('backupHistory', JSON.stringify(newHistory));

      setBackupStatus('Backup created successfully!');
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (error) {
      console.error('Error creating backup:', error);
      setBackupStatus('Error creating backup. Please try again.');
      setTimeout(() => setBackupStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };


  // Download backup
  const handleDownloadBackup = (backupId) => {
    try {
      const backupData = JSON.parse(localStorage.getItem(`backup_${backupId}`));
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gfg_rkgit_backup_${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading backup:', error);
    }
  };

  // Delete backup
  const handleDeleteBackup = (backupId) => {
    if (window.confirm('Are you sure you want to delete this backup?')) {
      localStorage.removeItem(`backup_${backupId}`);
      const newHistory = backupHistory.filter(backup => backup.id !== backupId);
      setBackupHistory(newHistory);
      localStorage.setItem('backupHistory', JSON.stringify(newHistory));
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Backup Manager</h2>
        <p className="text-muted-foreground">Create and download data backups</p>
      </div>

      {/* Status Messages */}
      {backupStatus && (
        <div className={`p-4 rounded-lg border ${
          backupStatus.includes('successfully') 
            ? 'bg-success/10 border-success/20 text-success' 
            : 'bg-error/10 border-error/20 text-error'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon name={backupStatus.includes('successfully') ? 'CheckCircle' : 'AlertCircle'} size={20} />
            <p className="text-sm font-medium">{backupStatus}</p>
          </div>
        </div>
      )}


      {/* Create Backup */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Create New Backup</h3>
            <p className="text-sm text-muted-foreground">
              Create a complete backup of all data including feedback, applications, and user accounts
            </p>
          </div>
          <Button
            variant="default"
            onClick={handleCreateBackup}
            loading={loading}
            disabled={loading}
            iconName="Database"
            iconPosition="left"
          >
            Create Backup
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="MessageSquare" size={16} className="text-primary" />
            <span className="text-muted-foreground">Feedback Submissions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-secondary" />
            <span className="text-muted-foreground">Career Applications</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="UserCog" size={16} className="text-accent" />
            <span className="text-muted-foreground">Admin Users</span>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Backup History</h3>
          <p className="text-sm text-muted-foreground">
            View and download your previous backups
          </p>
        </div>

        {backupHistory.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Database" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No backups found</p>
            <p className="text-sm text-muted-foreground">Create your first backup to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="p-4 hover:bg-muted/30 transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Database" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Backup {backup.id.split('_')[1]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(backup.timestamp)} • {formatFileSize(backup.size)}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span>{backup.metadata.totalFeedback} feedback</span>
                          <span>{backup.metadata.totalApplications} applications</span>
                          <span>{backup.metadata.totalUsers} users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      title="Download Backup"
                      onClick={() => handleDownloadBackup(backup.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      title="Delete Backup"
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="text-error hover:text-error"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-warning mb-2">Important Notes</h4>
            <ul className="text-sm text-warning/80 space-y-1">
              <li>• Backups are stored locally in your browser. Clear browser data to lose backups.</li>
              <li>• For production use, consider implementing cloud storage for backups.</li>
              <li>• Regular backups are recommended to prevent data loss.</li>
              <li>• Downloaded backups can be used for external storage or migration purposes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
