import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../../components/ui/Header';
import Footer from '../community-feedback-hub/components/Footer';
import { eventService, formatYearForDisplay, getEventTypeIcon, getEventTypeColor } from '../../utils/eventService';
import { registrationService } from '../../utils/registrationService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showAWSInstructions, setShowAWSInstructions] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEvent();
  }, [eventId]);


  const fetchEvent = async () => {
    setLoading(true);
    try {
      const result = await eventService.getEvent(eventId);
      if (result.success) {
        setEvent(result.data);
        // Set page title
        document.title = `${result.data.title} - Registration | GFG RKGIT`;
      } else {
        setError('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Error loading event');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    setShowSuccess(false);
    
    // Don't scroll immediately - let user see the loading state
    // window.scrollTo(0, 0);
    
    try {
      const result = await registrationService.registerForEvent(eventId, data, event.formConfig);
      if (result.success) {
        setShowSuccess(true);
        // Scroll to top after success to show success message
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
        // Reset form
        Object.keys(data).forEach(key => {
          // Reset form fields
        });
      } else {
        setError(result.error);
        // Scroll to top to show error message
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
      // Scroll to top to show error message
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getSectionOptions = () => {
    return event?.formConfig?.sectionOptions?.map(section => ({
      value: section,
      label: section
    })) || [];
  };

  const getBranchOptions = () => {
    return event?.formConfig?.branchOptions?.map(branch => ({
      value: branch,
      label: branch
    })) || [];
  };

  const getYearOptions = () => {
    return event?.formConfig?.yearOptions?.map(year => ({
      value: year, // Store as number (1, 2, 3, 4)
      label: formatYearForDisplay(year) // Display as formatted (1st Year, 2nd Year, etc.)
    })) || [];
  };

  const getHowDidYouHearOptions = () => {
    return event?.formConfig?.howDidYouHearOptions?.map(option => ({
      value: option,
      label: option
    })) || [];
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle other video platforms
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Return original URL for other platforms
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-16 lg:pt-18">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading event...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-16 lg:pt-18">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-error/10 rounded-full mb-6">
                <Icon name="AlertCircle" size={32} className="text-error" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {error || 'Event Not Found'}
              </h2>
              <p className="text-muted-foreground mb-8">
                The event you're looking for doesn't exist or is no longer available.
              </p>
              <Button onClick={() => navigate('/register')} iconName="ArrowLeft">
                Back to Events
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-16 lg:pt-18">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6 pulse-glow">
                <Icon name="CheckCircle" size={40} className="text-success" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Registration Successful!
              </h2>
              <p className="text-muted-foreground mb-8">
                Thank you for registering for <strong>{event.title}</strong>. 
                
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/register')} iconName="Calendar">
                  View Other Events
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} iconName="Home">
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const remainingSeats = event.maxParticipants - event.currentParticipants;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 lg:pt-18">
        {/* Registration Form */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Event Details */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${getEventTypeColor(event.title)}`}>
                      <Icon name={getEventTypeIcon(event.title)} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                      {event.instructor && (
                        <p className="text-sm text-muted-foreground">{event.instructor}</p>
                      )}
                    </div>
                  </div>

                  {/* Event Description */}
                  {event.description && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {event.description}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Calendar" size={20} className="text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground font-medium">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Clock" size={20} className="text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="text-foreground font-medium">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="MapPin" size={20} className="text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-foreground font-medium">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Users" size={20} className="text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Available Seats</p>
                        <p className="text-foreground font-medium">
                          {isEventFull ? '0' : remainingSeats} / {event.maxParticipants}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Event Status */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isEventFull 
                          ? 'text-error bg-error/10' 
                          : 'text-success bg-success/10'
                      }`}>
                        {isEventFull ? 'Full' : 'Open for Registration'}
                      </span>
                    </div>
                  </div>

                  {/* Additional Instructions */}
                  {(event.additionalInstructions || event.videoLink || event.websiteLink) && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <button
                        onClick={() => setShowAWSInstructions(!showAWSInstructions)}
                        className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-smooth"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name="Info" size={20} className="text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {event.instructionsTitle || 'Additional Instructions'}
                          </span>
                        </div>
                        <Icon 
                          name={showAWSInstructions ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                      </button>
                      
                      {showAWSInstructions && (
                        <div className="mt-4 space-y-4">
                          {event.additionalInstructions && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                              <div 
                                className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: event.additionalInstructions }}
                              />
                            </div>
                          )}

                          {event.videoLink && (
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-2">📺 {event.videoTitle || 'Video Tutorial'}</h5>
                              <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <iframe
                                  src={getEmbedUrl(event.videoLink)}
                                  title="Event Tutorial Video"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          )}

                          {event.websiteLink && (
                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-2">🌐 {event.websiteTitle || 'Additional Resources'}</h5>
                              <a
                                href={event.websiteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth text-sm font-medium"
                              >
                                <Icon name="ExternalLink" size={16} />
                                {event.websiteButtonText || 'Visit Resource Link'}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Registration Form</h2>
                    <p className="text-muted-foreground">
                      Please fill out the form below to register for this event.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="AlertCircle" size={20} className="text-error" />
                        <p className="text-error">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Required Fields */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name *"
                          placeholder="Enter your full name"
                          error={errors.name?.message}
                          {...register('name', { 
                            required: 'Full name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                          })}
                        />
                        
                        <Input
                          label="Email Address *"
                          type="email"
                          placeholder="your.email@example.com"
                          error={errors.email?.message}
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: { 
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                              message: 'Please enter a valid email address' 
                            }
                          })}
                        />
                      </div>

                      <Input
                        label="Roll Number *"
                        placeholder="Enter your roll number"
                        error={errors.rollNumber?.message}
                        {...register('rollNumber', { 
                          required: 'Roll number is required',
                          pattern: { value: /^[0-9A-Za-z]+$/, message: 'Invalid roll number format' }
                        })}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                          label="Section *"
                          options={getSectionOptions()}
                          placeholder="Select section"
                          error={errors.section?.message}
                          value={watch('section')}
                          onChange={(value) => {
                            register('section', { required: 'Please select your section' }).onChange({ target: { name: 'section', value } });
                          }}
                        />

                        <Select
                          label="Branch *"
                          options={getBranchOptions()}
                          placeholder="Select branch"
                          error={errors.branch?.message}
                          value={watch('branch')}
                          onChange={(value) => {
                            register('branch', { required: 'Please select your branch' }).onChange({ target: { name: 'branch', value } });
                          }}
                        />

                        <Select
                          label="Year *"
                          options={getYearOptions()}
                          placeholder="Select year"
                          error={errors.year?.message}
                          value={watch('year')}
                          onChange={(value) => {
                            register('year', { required: 'Please select your year' }).onChange({ target: { name: 'year', value } });
                          }}
                        />
                      </div>
                    </div>

                    {/* Optional Fields */}
                    {event.formConfig?.optionalFields && (
                      (event.formConfig.optionalFields.phone || 
                       event.formConfig.optionalFields.previousExperience || 
                       event.formConfig.optionalFields.specialRequirements || 
                       event.formConfig.optionalFields.howDidYouHear) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                          Additional Information
                        </h3>

                        {event.formConfig.optionalFields.phone && (
                          <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="Enter your phone number"
                            error={errors.phone?.message}
                            {...register('phone', { 
                              pattern: { 
                                value: /^[0-9]{10}$/, 
                                message: 'Please enter a valid 10-digit phone number' 
                              }
                            })}
                          />
                        )}

                        {event.formConfig.optionalFields.previousExperience && (
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Previous Experience
                            </label>
                            <textarea
                              {...register('previousExperience')}
                              rows={3}
                              className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                              placeholder="Describe your previous experience (optional)"
                            />
                          </div>
                        )}

                        {event.formConfig.optionalFields.specialRequirements && (
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Special Requirements
                            </label>
                            <textarea
                              {...register('specialRequirements')}
                              rows={3}
                              className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                              placeholder="Any special requirements or accommodations needed (optional)"
                            />
                          </div>
                        )}

                        {event.formConfig.optionalFields.howDidYouHear && (
                          <Select
                            label="How did you hear about this event?"
                            options={getHowDidYouHearOptions()}
                            placeholder="Select an option"
                            value={watch('howDidYouHear')}
                            onChange={(value) => {
                              register('howDidYouHear').onChange({ target: { name: 'howDidYouHear', value } });
                            }}
                          />
                        )}
                      </div>
                      )
                    )}

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-border">
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        loading={submitting}
                        disabled={submitting || isEventFull}
                        fullWidth
                        iconName="Send"
                        iconPosition="right"
                      >
                        {submitting ? 'Submitting Registration...' : isEventFull ? 'Registration Closed' : 'Submit Registration'}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By submitting this form, you agree to our privacy policy and terms of service.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventRegistration;
