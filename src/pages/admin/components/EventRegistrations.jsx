import React, { useState } from 'react';
import { exportWithHistory } from '../../../utils/exportUtils';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/dateUtils';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EventRegistrations = ({ event, registrations, loading, onClose, onExport }) => {
  const { adminUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [selectedFields, setSelectedFields] = useState([
    'rollNumber', 'name', 'email', 'branch', 'section', 'year', 'registrationDate'
  ]);

  const availableFields = [
    { key: 'rollNumber', label: 'Roll No' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'branch', label: 'Branch' },
    { key: 'section', label: 'Section' },
    { key: 'year', label: 'Year' },
    { key: 'phone', label: 'Phone' },
    { key: 'previousExperience', label: 'Previous Experience' },
    { key: 'specialRequirements', label: 'Special Requirements' },
    { key: 'howDidYouHear', label: 'How did you hear about this event?' },
    { key: 'registrationDate', label: 'Registration Date' }
  ];

  const getFilteredRegistrations = () => {
    return registrations.filter(registration => {
      const matchesSearch = !searchTerm || 
        registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBranch = !filterBranch || registration.branch === filterBranch;
      const matchesYear = !filterYear || registration.year === filterYear;
      const matchesSection = !filterSection || registration.section === filterSection;
      
      return matchesSearch && matchesBranch && matchesYear && matchesSection;
    });
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleSelectAllFields = () => {
    setSelectedFields(['rollNumber', 'name', 'email', 'branch', 'section', 'year', 'registrationDate']);
  };

  const handleClearFields = () => {
    setSelectedFields([]);
  };

  const handleExport = async () => {
    const filteredData = getFilteredRegistrations();
    const exportData = filteredData.map((registration, index) => {
      const data = {
        'S.No.': index + 1
      };
      selectedFields.forEach(field => {
        const fieldConfig = availableFields.find(f => f.key === field);
        if (fieldConfig) {
          if (field === 'registrationDate') {
            data[fieldConfig.label] = formatDate(registration[field]);
          } else if (field === 'year') {
            // Convert year to number format for export
            const yearValue = registration[field];
            // If it's formatted text, convert to number
            const yearMap = {
              '1st Year': '1',
              '2nd Year': '2',
              '3rd Year': '3',
              '4th Year': '4'
            };
            const numericYear = yearMap[yearValue] || yearValue;
            data[fieldConfig.label] = numericYear || 'N/A';
          } else {
            data[fieldConfig.label] = registration[field] || 'N/A';
          }
        }
      });
      return data;
    });

    await exportWithHistory(exportData, {
      format: 'excel',
      filename: `event_${event.id}_registrations`,
      exportType: 'event_registrations',
      title: `${event.title} - Registrations`,
      adminUser,
      filters: { 
        eventId: event.id,
        searchTerm,
        branch: filterBranch,
        year: filterYear,
        section: filterSection
      }
    });
  };


  const getUniqueValues = (field) => {
    const values = registrations.map(reg => reg[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const filteredRegistrations = getFilteredRegistrations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{event.title} - Registrations</h2>
          <p className="text-muted-foreground">
            {filteredRegistrations.length} of {registrations.length} registrations
          </p>
        </div>
        <Button variant="outline" onClick={onClose} iconName="X">
          Close
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Search"
            placeholder="Search by name, email, or roll number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconName="Search"
          />
          
          <Select
            label="Filter by Branch"
            value={filterBranch}
            onChange={setFilterBranch}
            options={[
              { value: '', label: 'All Branches' },
              ...getUniqueValues('branch').map(branch => ({ value: branch, label: branch }))
            ]}
          />
          
          <Select
            label="Filter by Year"
            value={filterYear}
            onChange={setFilterYear}
            options={[
              { value: '', label: 'All Years' },
              ...getUniqueValues('year').map(year => ({ value: year, label: year }))
            ]}
          />
          
          <Select
            label="Filter by Section"
            value={filterSection}
            onChange={setFilterSection}
            options={[
              { value: '', label: 'All Sections' },
              ...getUniqueValues('section').map(section => ({ value: section, label: section }))
            ]}
          />
        </div>
      </div>

      {/* Export Configuration */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Export Configuration</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={handleSelectAllFields}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearFields}>
            Clear All
          </Button>
          <Button onClick={handleExport} iconName="Download">
            Export Data
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={true}
              disabled={true}
              className="rounded border-border"
            />
            <span className="text-sm text-foreground font-medium">S.No.</span>
          </label>
          {availableFields.map(field => (
            <label key={field.key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFields.includes(field.key)}
                onChange={() => handleFieldToggle(field.key)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">{field.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-card rounded-lg border border-border">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading registrations...</p>
            </div>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/10 rounded-full mb-4">
              <Icon name="Users" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Registrations Found</h3>
            <p className="text-muted-foreground">
              {registrations.length === 0 
                ? 'No one has registered for this event yet.'
                : 'No registrations match your current filters.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">S.No.</th>
                  {selectedFields.map(field => {
                    const fieldConfig = availableFields.find(f => f.key === field);
                    return (
                      <th key={field} className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {fieldConfig?.label || field}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((registration, index) => (
                  <tr key={registration.id} className="border-b border-border hover:bg-muted/5">
                    <td className="p-4 text-sm text-foreground font-medium">
                      {index + 1}
                    </td>
                    {selectedFields.map(field => (
                      <td key={field} className="p-4 text-sm text-foreground">
                        {field === 'registrationDate' 
                          ? formatDate(registration[field])
                          : field === 'year' 
                            ? (registration[field] === '1' ? '1st Year' : 
                               registration[field] === '2' ? '2nd Year' : 
                               registration[field] === '3' ? '3rd Year' : 
                               registration[field] === '4' ? '4th Year' : 
                               registration[field] || 'N/A')
                            : registration[field] || 'N/A'
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrations;
