import React, { useState, useEffect } from 'react';
import { getAllExportHistory, getExportStatistics, formatExportHistory } from '../../../utils/exportHistoryService';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ExportHistoryViewer = () => {
  const [exportHistory, setExportHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormat, setFilterFormat] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;
  const { adminUser, hasRole } = useAuth();

  // Filter options
  const formatOptions = [
    { value: '', label: 'All Formats' },
    { value: 'excel', label: 'Excel (.xlsx)' },
    { value: 'html', label: 'HTML (.html)' },
    { value: 'csv', label: 'CSV (.csv)' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'applications', label: 'Applications' },
    { value: 'users', label: 'Users' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Fetch export history and statistics (only for super admins)
  useEffect(() => {
    // Only fetch data if user is super admin
    if (!hasRole('super_admin')) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyResult, statsResult] = await Promise.all([
          getAllExportHistory(1000), // Get more records for filtering
          getExportStatistics()
        ]);

        if (historyResult.success) {
          setExportHistory(historyResult.data);
        }

        if (statsResult.success) {
          setStatistics(statsResult.data);
        }
      } catch (error) {
        console.error('Error fetching export history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasRole]);

  // Filter data without side effects
  const getFilteredData = () => {
    let filtered = exportHistory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.exportId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply format filter
    if (filterFormat) {
      filtered = filtered.filter(item => item.exportFormat === filterFormat);
    }

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(item => item.exportType === filterType);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    return filtered;
  };

  // Update pagination when filters change
  useEffect(() => {
    const filtered = getFilteredData();
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [exportHistory, searchTerm, filterFormat, filterType, filterStatus, itemsPerPage]);

  // Get paginated data
  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
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

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success';
      case 'failed':
        return 'bg-error/10 text-error';
      case 'cancelled':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  // Get format icon
  const getFormatIcon = (format) => {
    switch (format) {
      case 'excel':
        return 'FileSpreadsheet';
      case 'html':
        return 'FileText';
      case 'csv':
        return 'FileSpreadsheet';
      default:
        return 'File';
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterFormat('');
    setFilterType('');
    setFilterStatus('');
  };

  // Check if user is super admin
  if (!hasRole('super_admin')) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-error" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            Export history is only accessible to Super Administrators. 
            Contact your system administrator if you need access to this information.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading export history...</p>
        </div>
      </div>
    );
  }

  const paginatedData = getPaginatedData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Export History</h2>
        <p className="text-muted-foreground">Track and monitor all data export activities</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Exports</p>
                <p className="text-3xl font-bold text-foreground">{statistics.totalExports}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Download" size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-3xl font-bold text-success">{statistics.successfulExports}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-success" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold text-error">{statistics.failedExports}</p>
              </div>
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                <Icon name="XCircle" size={24} className="text-error" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Records Exported</p>
                <p className="text-3xl font-bold text-foreground">{statistics.totalRecordsExported.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={24} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            label="Search"
            placeholder="Search by filename, email, or export ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            label="Format"
            options={formatOptions}
            value={filterFormat}
            onChange={setFilterFormat}
          />
          
          <Select
            label="Type"
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Export History Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Export Details</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Admin</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Type & Format</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Records</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{item.filename}</p>
                      <p className="text-sm text-muted-foreground">ID: {item.exportId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-foreground">{item.adminEmail}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.adminRole.replace('_', ' ')}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Icon name={getFormatIcon(item.exportFormat)} size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground capitalize">{item.exportType}</p>
                        <p className="text-xs text-muted-foreground uppercase">{item.exportFormat}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">{item.recordCount.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.timestamp)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        title="View Details"
                        onClick={() => {
                          // TODO: Implement view details modal
                          console.log('View details for:', item.exportId);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              />
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              />
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Download" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Export History Found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterFormat || filterType || filterStatus 
              ? 'No exports match your current filters. Try adjusting your search criteria.'
              : 'No export activities have been recorded yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportHistoryViewer;
