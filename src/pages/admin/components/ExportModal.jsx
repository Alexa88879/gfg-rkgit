import React, { useState } from 'react';
import { exportWithHistory, getAvailableFields, formatDataForExport } from '../../../utils/exportUtils';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, data, type = 'feedback', title = 'Export Data', filters = {} }) => {
  const [exportFormat, setExportFormat] = useState('excel');
  const [filename, setFilename] = useState(`gfg_rkgit_${type}_${new Date().toISOString().split('T')[0]}`);
  const [selectedFields, setSelectedFields] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const { adminUser } = useAuth();

  // Get available fields
  const availableFields = getAvailableFields(data, type);

  // Format options
  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: 'FileSpreadsheet' },
    { value: 'html', label: 'HTML (.html)', icon: 'FileText' },
    { value: 'csv', label: 'CSV (.csv)', icon: 'FileSpreadsheet' }
  ];

  // Handle field selection
  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  // Handle select all fields
  const handleSelectAll = () => {
    if (selectedFields.length === availableFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(availableFields.map(field => field.value));
    }
  };

  // Handle export
  const handleExport = async () => {
    if (!data || data.length === 0) {
      setExportStatus('No data to export');
      return;
    }

    if (selectedFields.length === 0) {
      setExportStatus('Please select at least one field to export');
      return;
    }

    setIsExporting(true);
    setExportStatus('');

    try {
      const fieldsToExport = selectedFields;
      const formattedData = formatDataForExport(data, fieldsToExport);

      // Use the new export with history function
      const result = await exportWithHistory(formattedData, {
        format: exportFormat,
        filename,
        selectedFields: fieldsToExport,
        exportType: type,
        title,
        adminUser,
        filters
      });

      if (result.success) {
        setExportStatus('Export completed successfully!');
        setTimeout(() => {
          onClose();
          setExportStatus('');
        }, 2000);
      } else {
        setExportStatus(result.message || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">
                Export {data?.length || 0} records in your preferred format
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setExportFormat(option.value)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg border transition-smooth
                    ${exportFormat === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={option.icon} size={20} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filename */}
          <Input
            label="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
          />

          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">
                Select Fields to Export
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary hover:text-primary/80 transition-smooth"
              >
                {selectedFields.length === availableFields.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
              {availableFields.map((field) => (
                <div key={field.value} className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedFields.includes(field.value)}
                    onChange={() => handleFieldToggle(field.value)}
                  />
                  <span className="text-sm text-foreground">{field.label}</span>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {selectedFields.length} of {availableFields.length} fields selected
            </p>
          </div>

          {/* Export Status */}
          {exportStatus && (
            <div className={`p-3 rounded-lg border ${
              exportStatus.includes('successfully') 
                ? 'bg-success/10 border-success/20 text-success' 
                : 'bg-error/10 border-error/20 text-error'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon name={exportStatus.includes('successfully') ? 'CheckCircle' : 'AlertCircle'} size={16} />
                <p className="text-sm font-medium">{exportStatus}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleExport}
              loading={isExporting}
              disabled={isExporting || !data || data.length === 0 || selectedFields.length === 0}
              iconName="Download"
              iconPosition="left"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
