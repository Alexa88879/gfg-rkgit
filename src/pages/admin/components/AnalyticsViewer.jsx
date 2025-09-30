import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import Icon from '../../../components/AppIcon';

const AnalyticsViewer = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    totalApplications: 0,
    averageRating: 0,
    departmentStats: {},
    yearStats: {},
    domainStats: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch feedback data
        const feedbackQuery = query(collection(db, 'feedback'));
        const feedbackSnapshot = await getDocs(feedbackQuery);
        const feedbackData = feedbackSnapshot.docs.map(doc => doc.data());

        // Fetch applications data
        const applicationsQuery = query(collection(db, 'career-applications'));
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applicationsData = applicationsSnapshot.docs.map(doc => doc.data());

        // Calculate statistics
        const totalFeedback = feedbackData.length;
        const totalApplications = applicationsData.length;

        // Calculate average rating
        const totalRatings = feedbackData.reduce((sum, item) => {
          const ratings = item.ratings || {};
          const values = Object.values(ratings).filter(val => typeof val === 'number' && val > 0);
          return sum + (values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0);
        }, 0);
        const averageRating = totalFeedback > 0 ? (totalRatings / totalFeedback).toFixed(1) : 0;

        // Department statistics
        const departmentStats = feedbackData.reduce((acc, item) => {
          const dept = item.department || 'Unknown';
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});

        // Year statistics
        const yearStats = feedbackData.reduce((acc, item) => {
          const year = item.year || 'Unknown';
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});

        // Domain statistics
        const domainStats = applicationsData.reduce((acc, item) => {
          const domain = item.domainInterest || 'Unknown';
          acc[domain] = (acc[domain] || 0) + 1;
          return acc;
        }, {});

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentActivity = [
          ...feedbackData.filter(item => new Date(item.timestamp) >= sevenDaysAgo).map(item => ({
            type: 'feedback',
            name: item.fullName,
            timestamp: item.timestamp,
            data: item
          })),
          ...applicationsData.filter(item => new Date(item.timestamp) >= sevenDaysAgo).map(item => ({
            type: 'application',
            name: item.fullName,
            timestamp: item.timestamp,
            data: item
          }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setStats({
          totalFeedback,
          totalApplications,
          averageRating,
          departmentStats,
          yearStats,
          domainStats,
          recentActivity
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render star rating
  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="Star"
            size={14}
            className={star <= numRating ? 'text-warning' : 'text-muted-foreground'}
            style={{ fill: star <= numRating ? 'currentColor' : 'none' }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!stats || (stats.totalFeedback === 0 && stats.totalApplications === 0)) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
          <p className="text-muted-foreground">Insights and statistics for GFG RKGIT Portal</p>
        </div>

        {/* Empty State */}
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="BarChart3" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
          <p className="text-muted-foreground">
            No feedback or applications have been submitted yet. Analytics will appear here once data is available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
        <p className="text-muted-foreground">Insights and statistics for GFG RKGIT Portal</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Feedback</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalFeedback}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-foreground">{stats.averageRating}</p>
                {renderStars(stats.averageRating)}
              </div>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Star" size={24} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalFeedback + stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={24} className="text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Feedback by Department</h3>
          <div className="space-y-3">
            {Object.entries(stats.departmentStats).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{dept}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(count / stats.totalFeedback) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Interest Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Applications by Domain</h3>
          <div className="space-y-3">
            {Object.entries(stats.domainStats).map(([domain, count]) => (
              <div key={domain} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{domain}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${(count / stats.totalApplications) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.recentActivity.slice(0, 10).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon 
                  name={activity.type === 'feedback' ? 'MessageSquare' : 'Users'} 
                  size={16} 
                  className="text-primary" 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.name} {activity.type === 'feedback' ? 'submitted feedback' : `applied for ${activity.data.domainInterest || 'career'}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsViewer;
