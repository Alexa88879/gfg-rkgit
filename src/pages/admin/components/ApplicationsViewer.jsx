import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ExportModal from './ExportModal';

const ApplicationsViewer = () => {
  const [applicationsData, setApplicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState([]);
  const itemsPerPage = 10;

  // Filter options
  const domainOptions = [
    { value: '', label: 'All Domains' },
    { value: 'Designing', label: 'Designing' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Documentation', label: 'Documentation' },
    { value: 'Video Editor', label: 'Video Editor' },
    { value: 'Management', label: 'Management' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'timestamp', label: 'Application Date' },
    { value: 'fullName', label: 'Name' },
    { value: 'domainInterest', label: 'Domain Interest' },
    { value: 'status', label: 'Status' }
  ];

  // Fetch applications data
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // Build query with proper compound query handling
        let q;
        
        if (filterDomain && filterStatus) {
          // Both filters - compound query
          q = query(
            collection(db, 'career-applications'), 
            where('domainInterest', '==', filterDomain),
            where('status', '==', filterStatus),
            orderBy(sortBy, sortOrder)
          );
        } else if (filterDomain) {
          // Only domain filter
          q = query(
            collection(db, 'career-applications'), 
            where('domainInterest', '==', filterDomain),
            orderBy(sortBy, sortOrder)
          );
        } else if (filterStatus) {
          // Only status filter
          q = query(
            collection(db, 'career-applications'), 
            where('status', '==', filterStatus),
            orderBy(sortBy, sortOrder)
          );
        } else {
          // No filters - just order by
          q = query(collection(db, 'career-applications'), orderBy(sortBy, sortOrder));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          let data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Apply search filter (client-side for better performance with text search)
          if (searchTerm) {
            data = data.filter(item => 
              item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          setApplicationsData(data);
          setTotalItems(data.length);
          setTotalPages(Math.ceil(data.length / itemsPerPage));
          setCurrentPage(1);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching applications:', error);
          setLoading(false);
          // Show user-friendly error message
          if (error.code === 'permission-denied') {
            console.error('Permission denied: User may not have access to applications data');
          } else if (error.code === 'unavailable') {
            console.error('Firebase service unavailable');
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, [searchTerm, filterDomain, filterStatus, sortBy, sortOrder]);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return applicationsData.slice(startIndex, endIndex);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === getPaginatedData().length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(getPaginatedData().map(item => item.id));
    }
  };

  // Handle individual selection
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle export selected
  const handleExportSelected = () => {
    const selectedData = applicationsData.filter(item => selectedItems.includes(item.id));
    setExportData(selectedData);
    setShowExportModal(true);
  };

  // Handle export all
  const handleExportAll = () => {
    setExportData(applicationsData);
    setShowExportModal(true);
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
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'reviewed':
        return 'bg-info/10 text-info';
      case 'accepted':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  // Truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading applications data...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (applicationsData.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Career Applications</h2>
            <p className="text-muted-foreground">No career applications found</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterDomain || filterStatus 
              ? 'No applications match your current filters. Try adjusting your search criteria.'
              : 'No career applications have been submitted yet.'
            }
          </p>
          {(searchTerm || filterDomain || filterStatus) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterDomain('');
                setFilterStatus('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Career Applications</h2>
          <p className="text-muted-foreground">
            {totalItems} total applications • {selectedItems.length} selected
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            disabled={selectedItems.length === 0}
            onClick={handleExportSelected}
          >
            Export Selected ({selectedItems.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleExportAll}
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Search"
            placeholder="Search by name, email, or roll number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            label="Domain Interest"
            options={domainOptions}
            value={filterDomain}
            onChange={setFilterDomain}
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Sort By</label>
            <div className="flex space-x-2">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === getPaginatedData().length && getPaginatedData().length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Domain</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Time Commitment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Applied</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {getPaginatedData().map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{item.fullName}</p>
                      <p className="text-sm text-muted-foreground">{item.rollNumber}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-foreground">{item.email}</p>
                      <p className="text-sm text-muted-foreground">{item.contactNumber}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {item.domainInterest}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">
                      {item.timeCommitment}
                    </span>
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

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={exportData}
        type="applications"
        title="Export Applications Data"
        filters={{
          searchTerm,
          filterDomain,
          filterStatus,
          sortBy,
          sortOrder
        }}
      />
    </div>
  );
};

export default ApplicationsViewer;