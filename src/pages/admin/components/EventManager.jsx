import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { eventService } from '../../../utils/eventService';
import { registrationService } from '../../../utils/registrationService';
import { exportWithHistory } from '../../../utils/exportUtils';
import { formatDate } from '../../../utils/dateUtils';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import EventForm from './EventForm';
import EventRegistrations from './EventRegistrations';

const EventManager = () => {
  const { adminUser, hasPermission } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const result = await eventService.getAllEvents();
      if (result.success) {
        setEvents(result.data);
      } else {
        console.error('Error fetching events:', result.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventRegistrations = async (eventId) => {
    setRegistrationsLoading(true);
    try {
      const result = await registrationService.getEventRegistrations(eventId);
      if (result.success) {
        setRegistrations(result.data);
      } else {
        console.error('Error fetching registrations:', result.error);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowCreateForm(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEditForm(true);
  };

  const handleViewRegistrations = async (event) => {
    setSelectedEvent(event);
    await fetchEventRegistrations(event.id);
    setShowRegistrations(true);
  };

  const handleExportRegistrations = async (event) => {
    try {
      const result = await registrationService.getEventRegistrations(event.id);
      if (result.success) {
        // Process the data for export (convert year back to numbers)
        const exportData = result.data.map((registration, index) => {
          // Convert year back to number for export
          const yearMap = {
            '1st Year': '1',
            '2nd Year': '2',
            '3rd Year': '3',
            '4th Year': '4'
          };
          const numericYear = yearMap[registration.year] || registration.year || 'N/A';
          
          return {
            'S.No.': index + 1,
            'Roll No': registration.rollNumber || 'N/A',
            'Name': registration.name || 'N/A',
            'Email': registration.email || 'N/A',
            'Branch': registration.branch || 'N/A',
            'Section': registration.section || 'N/A',
            'Year': numericYear,
            'Registration Date': formatDate(registration.registrationDate)
          };
        });

        await exportWithHistory(exportData, {
          format: 'excel',
          filename: `event_${event.id}_registrations`,
          exportType: 'event_registrations',
          title: `${event.title} - Registrations`,
          adminUser,
          filters: { eventId: event.id }
        });
      }
    } catch (error) {
      console.error('Error exporting registrations:', error);
    }
  };

  const handleUpdateEventStatus = async (eventId, status) => {
    try {
      const result = await eventService.updateEventStatus(eventId, status);
      if (result.success) {
        fetchEvents();
      } else {
        console.error('Error updating event status:', result.error);
      }
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-warning bg-warning/10';
      case 'completed':
        return 'text-muted-foreground bg-muted/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <EventForm
        event={null}
        onClose={() => setShowCreateForm(false)}
        onSuccess={() => {
          setShowCreateForm(false);
          fetchEvents();
        }}
      />
    );
  }

  if (showEditForm) {
    return (
      <EventForm
        event={selectedEvent}
        onClose={() => setShowEditForm(false)}
        onSuccess={() => {
          setShowEditForm(false);
          fetchEvents();
        }}
      />
    );
  }

  if (showRegistrations) {
    return (
      <EventRegistrations
        event={selectedEvent}
        registrations={registrations}
        loading={registrationsLoading}
        onClose={() => setShowRegistrations(false)}
        onExport={() => handleExportRegistrations(selectedEvent)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage events and view registrations
          </p>
        </div>
        {hasPermission('canManageUsers') && (
          <Button onClick={handleCreateEvent} iconName="Plus">
            Create New Event
          </Button>
        )}
      </div>

      {/* Events List */}
      <div className="grid gap-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/10 rounded-full mb-4">
              <Icon name="Calendar" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first event to get started
            </p>
            {hasPermission('canManageUsers') && (
              <Button onClick={handleCreateEvent} iconName="Plus">
                Create First Event
              </Button>
            )}
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-foreground font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-foreground font-medium">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {event.currentParticipants || 0}/{event.maxParticipants} participants
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewRegistrations(event)}
                    iconName="Users"
                  >
                    View Registrations
                  </Button>
                  
                  {hasPermission('canExportData') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportRegistrations(event)}
                      iconName="Download"
                    >
                      Export
                    </Button>
                  )}
                  
                  {hasPermission('canManageUsers') && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                        iconName="Edit"
                      >
                        Edit
                      </Button>
                      
                      <Select
                        value={event.status}
                        onChange={(value) => handleUpdateEventStatus(event.id, value)}
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                          { value: 'completed', label: 'Completed' }
                        ]}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventManager;
