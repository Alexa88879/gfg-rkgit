import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ExportModal from './ExportModal';

const FeedbackViewer = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
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
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'CE', label: 'Civil Engineering' },
    { value: 'EE', label: 'Electrical Engineering' }
  ];

  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: '2nd', label: '2nd Year' },
    { value: '3rd', label: '3rd Year' },
    { value: '4th', label: '4th Year' }
  ];

  const sortOptions = [
    { value: 'timestamp', label: 'Submission Date' },
    { value: 'fullName', label: 'Name' },
    { value: 'department', label: 'Department' },
    { value: 'year', label: 'Year' }
  ];

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        // Build query with proper compound query handling
        let q;
        
        if (filterDepartment && filterYear) {
          // Both filters - compound query
          q = query(
            collection(db, 'feedback'), 
            where('department', '==', filterDepartment),
            where('year', '==', filterYear),
            orderBy(sortBy, sortOrder)
          );
        } else if (filterDepartment) {
          // Only department filter
          q = query(
            collection(db, 'feedback'), 
            where('department', '==', filterDepartment),
            orderBy(sortBy, sortOrder)
          );
        } else if (filterYear) {
          // Only year filter
          q = query(
            collection(db, 'feedback'), 
            where('year', '==', filterYear),
            orderBy(sortBy, sortOrder)
          );
        } else {
          // No filters - just order by
          q = query(collection(db, 'feedback'), orderBy(sortBy, sortOrder));
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

          setFeedbackData(data);
          setTotalItems(data.length);
          setTotalPages(Math.ceil(data.length / itemsPerPage));
          setCurrentPage(1);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching feedback:', error);
          setLoading(false);
          // Show user-friendly error message
          if (error.code === 'permission-denied') {
            console.error('Permission denied: User may not have access to feedback data');
          } else if (error.code === 'unavailable') {
            console.error('Firebase service unavailable');
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [searchTerm, filterDepartment, filterYear, sortBy, sortOrder]);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return feedbackData.slice(startIndex, endIndex);
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
    const selectedData = feedbackData.filter(item => selectedItems.includes(item.id));
    setExportData(selectedData);
    setShowExportModal(true);
  };

  // Handle export all
  const handleExportAll = () => {
    setExportData(feedbackData);
    setShowExportModal(true);
  };

  // Calculate average ratings
  const calculateAverageRating = (ratings) => {
    const values = Object.values(ratings).filter(val => typeof val === 'number' && val > 0);
    return values.length > 0 ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1) : 'N/A';
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
            className={star <= numRating ? 'text-warning fill-current' : 'text-muted-foreground'}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (feedbackData.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Feedback Submissions</h2>
            <p className="text-muted-foreground">No feedback submissions found</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageSquare" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Feedback Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterDepartment || filterYear 
              ? 'No feedback matches your current filters. Try adjusting your search criteria.'
              : 'No feedback submissions have been received yet.'
            }
          </p>
          {(searchTerm || filterDepartment || filterYear) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('');
                setFilterYear('');
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
          <h2 className="text-2xl font-bold text-foreground">Feedback Submissions</h2>
          <p className="text-muted-foreground">
            {totalItems} total submissions • {selectedItems.length} selected
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
            label="Department"
            options={departmentOptions}
            value={filterDepartment}
            onChange={setFilterDepartment}
          />
          
          <Select
            label="Year"
            options={yearOptions}
            value={filterYear}
            onChange={setFilterYear}
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
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Submitted</th>
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
                      <p className="text-sm text-muted-foreground">{item.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {item.department}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">
                      {item.year}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {renderStars(calculateAverageRating(item.ratings))}
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
        type="feedback"
        title="Export Feedback Data"
        filters={{
          searchTerm,
          filterDepartment,
          filterYear,
          sortBy,
          sortOrder
        }}
      />
    </div>
  );
};

export default FeedbackViewer;