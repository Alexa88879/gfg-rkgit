import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { eventService } from '../../../utils/eventService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const EventForm = ({ event, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formConfig, setFormConfig] = useState({
    requiredFields: {
      name: true,
      email: true,
      rollNumber: true,
      section: true,
      branch: true,
      year: true
    },
    optionalFields: {
      phone: false,
      previousExperience: false,
      specialRequirements: false,
      howDidYouHear: false
    },
    sectionOptions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    branchOptions: ['CSE', 'IT', 'ECE'],
    yearOptions: ['1', '2', '3', '4'],
    howDidYouHearOptions: [
      'Social Media',
      'College Notice Board',
      'Friend/Classmate',
      'Faculty Member',
      'Other'
    ]
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: event ? {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      instructor: event.instructor,
      maxParticipants: event.maxParticipants,
      additionalInstructions: event.additionalInstructions || '',
      instructionsTitle: event.instructionsTitle || 'Additional Instructions',
      videoLink: event.videoLink || '',
      websiteLink: event.websiteLink || '',
      videoTitle: event.videoTitle || 'Video Tutorial',
      websiteTitle: event.websiteTitle || 'Additional Resources',
      websiteButtonText: event.websiteButtonText || 'Visit Resource Link'
    } : {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      instructor: '',
      maxParticipants: 30,
      additionalInstructions: '',
      instructionsTitle: 'Additional Instructions',
      videoLink: '',
      websiteLink: '',
      videoTitle: 'Video Tutorial',
      websiteTitle: 'Additional Resources',
      websiteButtonText: 'Visit Resource Link'
    }
  });

  useEffect(() => {
    if (event && event.formConfig) {
      setFormConfig(event.formConfig);
    }
  }, [event]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const eventData = {
        ...data,
        formConfig,
        status: 'active'
      };

      let result;
      if (event) {
        result = await eventService.updateEvent(event.id, eventData);
      } else {
        result = await eventService.createEvent(eventData);
      }

      if (result.success) {
        onSuccess();
      } else {
        console.error('Error saving event:', result.error);
        alert('Error saving event: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionalFieldToggle = (field) => {
    setFormConfig(prev => ({
      ...prev,
      optionalFields: {
        ...prev.optionalFields,
        [field]: !prev.optionalFields[field]
      }
    }));
  };

  const handleSectionToggle = (section) => {
    setFormConfig(prev => ({
      ...prev,
      sectionOptions: prev.sectionOptions.includes(section)
        ? prev.sectionOptions.filter(s => s !== section)
        : [...prev.sectionOptions, section]
    }));
  };

  const handleBranchToggle = (branch) => {
    setFormConfig(prev => ({
      ...prev,
      branchOptions: prev.branchOptions.includes(branch)
        ? prev.branchOptions.filter(b => b !== branch)
        : [...prev.branchOptions, branch]
    }));
  };

  const handleYearToggle = (year) => {
    setFormConfig(prev => ({
      ...prev,
      yearOptions: prev.yearOptions.includes(year)
        ? prev.yearOptions.filter(y => y !== year)
        : [...prev.yearOptions, year]
    }));
  };

  const allSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const allBranches = ['CSE', 'IT', 'CS', 'AIML', 'DS', 'ECE', 'IOT', 'BCA', 'MCA', 'MBA'];
  const allYears = ['1', '2', '3', '4'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <Button variant="outline" onClick={onClose} iconName="X">
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Event Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Event Title *"
                placeholder="Enter event title"
                error={errors.title?.message}
                {...register('title', { required: 'Event title is required' })}
              />
              
              <Input
                label="Instructor/Speaker"
                placeholder="Enter instructor name"
                {...register('instructor')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Date *"
                type="date"
                error={errors.date?.message}
                {...register('date', { required: 'Date is required' })}
              />
              
              <Input
                label="Time *"
                placeholder="e.g., 2:00 PM - 4:00 PM"
                error={errors.time?.message}
                {...register('time', { required: 'Time is required' })}
              />
              
              <Input
                label="Location *"
                placeholder="Enter location"
                error={errors.location?.message}
                {...register('location', { required: 'Location is required' })}
              />
            </div>

            <Input
              label="Maximum Participants *"
              type="number"
              min="1"
              error={errors.maxParticipants?.message}
              {...register('maxParticipants', { 
                required: 'Maximum participants is required',
                min: { value: 1, message: 'Must be at least 1' }
              })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Instructions Section Title
                </label>
                <Input
                  placeholder="Additional Instructions"
                  {...register('instructionsTitle')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Custom title for the instructions section (default: "Additional Instructions")
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Instructions Content (Optional)
                </label>
                <textarea
                  {...register('additionalInstructions')}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                  placeholder="Enter any additional instructions for participants (e.g., prerequisites, materials to bring, account setup instructions, etc.)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  These instructions will be displayed to participants during registration.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Video Link (Optional)
                </label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  {...register('videoLink')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  YouTube or other video platform link. Will be displayed as an embedded video.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website Link (Optional)
                </label>
                <Input
                  placeholder="https://example.com"
                  {...register('websiteLink')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  External website link. Will be displayed as a clickable button.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Video Section Title
                </label>
                <Input
                  placeholder="Video Tutorial"
                  {...register('videoTitle')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Custom title for the video section (default: "Video Tutorial")
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website Section Title
                </label>
                <Input
                  placeholder="Additional Resources"
                  {...register('websiteTitle')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Custom title for the website section (default: "Additional Resources")
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Website Button Text
              </label>
              <Input
                placeholder="Visit Resource Link"
                {...register('websiteButtonText')}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Custom text for the website button (default: "Visit Resource Link")
              </p>
            </div>
          </div>

          {/* Form Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Registration Form Configuration
            </h3>

            {/* Optional Fields */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Optional Fields (Choose which to include)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Checkbox
                  label="Phone Number"
                  checked={formConfig.optionalFields.phone}
                  onChange={() => handleOptionalFieldToggle('phone')}
                />
                <Checkbox
                  label="Previous Experience"
                  checked={formConfig.optionalFields.previousExperience}
                  onChange={() => handleOptionalFieldToggle('previousExperience')}
                />
                <Checkbox
                  label="Special Requirements"
                  checked={formConfig.optionalFields.specialRequirements}
                  onChange={() => handleOptionalFieldToggle('specialRequirements')}
                />
                <Checkbox
                  label="How did you hear about this event?"
                  checked={formConfig.optionalFields.howDidYouHear}
                  onChange={() => handleOptionalFieldToggle('howDidYouHear')}
                />
              </div>
            </div>

            {/* Section Options */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Section Options (Choose which sections to show)
              </label>
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {allSections.map(section => (
                  <Checkbox
                    key={section}
                    label={section}
                    checked={formConfig.sectionOptions.includes(section)}
                    onChange={() => handleSectionToggle(section)}
                  />
                ))}
              </div>
            </div>

            {/* Branch Options */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Branch Options (Choose which branches to show)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {allBranches.map(branch => (
                  <Checkbox
                    key={branch}
                    label={branch}
                    checked={formConfig.branchOptions.includes(branch)}
                    onChange={() => handleBranchToggle(branch)}
                  />
                ))}
              </div>
            </div>

            {/* Year Options */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Year Options (Choose which years to show)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {allYears.map(year => (
                  <Checkbox
                    key={year}
                    label={`${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`}
                    checked={formConfig.yearOptions.includes(year)}
                    onChange={() => handleYearToggle(year)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
