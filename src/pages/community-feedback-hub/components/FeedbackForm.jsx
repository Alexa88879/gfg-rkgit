import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ratings, setRatings] = useState({
    eventQuality: 0,
    contentRelevance: 0,
    speakerEffectiveness: 0,
    organizationLevel: 0,
    overallSatisfaction: 0
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const yearOptions = [
    { value: '2nd', label: '2nd Year' },
    { value: '3rd', label: '3rd Year' },
    { value: '4th', label: '4th Year' }
  ];

  const sectionOptions = [
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' },
    { value: 'D', label: 'Section D' },
    { value: 'E', label: 'Section E' },
    { value: 'F', label: 'Section F' },
    { value: 'G', label: 'Section G' },
    { value: 'H', label: 'Section H' }
  ];

  const departmentOptions = [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'CE', label: 'Civil Engineering' },
    { value: 'EE', label: 'Electrical Engineering' }
  ];

  const ratingQuestions = [
    { key: 'eventQuality', label: 'Event Quality', description: 'How would you rate the overall quality of the event?' },
    { key: 'contentRelevance', label: 'Content Relevance', description: 'How relevant was the content to your learning goals?' },
    { key: 'speakerEffectiveness', label: 'Speaker Effectiveness', description: 'How effective were the speakers/presenters?' },
    { key: 'organizationLevel', label: 'Organization Level', description: 'How well was the event organized?' },
    { key: 'overallSatisfaction', label: 'Overall Satisfaction', description: 'Your overall satisfaction with the event?' }
  ];

  const handleRatingClick = (questionKey, rating) => {
    setRatings(prev => ({
      ...prev,
      [questionKey]: rating
    }));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        ...data,
        ratings,
        hiddenEmail: 'siri888792@gmail.com',
        timestamp: new Date().toISOString(),
        submissionId: Math.random().toString(36).substr(2, 9)
      };

      // Submit to Firebase
      const docRef = await addDoc(collection(db, "feedback"), feedbackData);
      console.log('Feedback submitted with ID:', docRef.id);
      
      setShowSuccess(true);
      reset();
      setRatings({
        eventQuality: 0,
        contentRelevance: 0,
        speakerEffectiveness: 0,
        organizationLevel: 0,
        overallSatisfaction: 0
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ questionKey, label, description, currentRating }) => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {label} <span className="text-error">*</span>
        </label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5]?.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleRatingClick(questionKey, rating)}
            className={`
              p-2 rounded-lg transition-smooth hover:scale-110
              ${currentRating >= rating 
                ? 'text-warning' :'text-muted-foreground hover:text-warning'
              }
            `}
          >
            <Icon 
              name={currentRating >= rating ? 'Star' : 'Star'} 
              size={24}
              className={currentRating >= rating ? 'fill-current' : ''}
            />
          </button>
        ))}
        <span className="ml-3 text-sm text-muted-foreground">
          {currentRating > 0 ? `${currentRating}/5` : 'Not rated'}
        </span>
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6 pulse-glow">
          <Icon name="CheckCircle" size={40} className="text-success" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-4">
          Thank You for Your Feedback!
        </h3>
        <p className="text-muted-foreground mb-8">
          Your valuable input helps us improve our events and community experience. 
          We appreciate your time and contribution to the GFG RKGIT chapter.
        </p>
        <Button
          variant="outline"
          onClick={() => setShowSuccess(false)}
          iconName="Plus"
          iconPosition="left"
        >
          Submit Another Feedback
        </Button>
      </div>
    );
  }

  return (
    <section id="feedback-form" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Icon name="MessageSquare" size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Share Your Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us improve by sharing your honest feedback about our events and initiatives. 
            Your input is valuable and helps shape our community's future.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border elevation-2 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Rating Questions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Event Rating
              </h3>
              {ratingQuestions?.map((question) => (
                <RatingStars
                  key={question?.key}
                  questionKey={question?.key}
                  label={question?.label}
                  description={question?.description}
                  currentRating={ratings?.[question?.key]}
                />
              ))}
            </div>

            {/* Overall Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Overall Experience
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Please share your detailed feedback <span className="text-error">*</span>
                </label>
                <textarea
                  {...register('overallExperience', { 
                    required: 'Please share your experience',
                    minLength: { value: 10, message: 'Please provide at least 10 characters' }
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                  placeholder="Tell us about your experience, what you liked, and what could be improved..."
                />
                {errors?.overallExperience && (
                  <p className="mt-1 text-sm text-error">{errors?.overallExperience?.message}</p>
                )}
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  error={errors?.fullName?.message}
                  {...register('fullName', { 
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />

                <Input
                  label="Roll Number"
                  type="text"
                  placeholder="Enter your roll number"
                  required
                  error={errors?.rollNumber?.message}
                  {...register('rollNumber', { 
                    required: 'Roll number is required',
                    pattern: { value: /^[0-9A-Za-z]+$/, message: 'Invalid roll number format' }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Department"
                  options={departmentOptions}
                  placeholder="Select department"
                  required
                  error={errors?.department?.message}
                  value={watch('department')}
                  onChange={(value) => {
                    register('department', { required: 'Please select your department' }).onChange({ target: { name: 'department', value } });
                  }}
                />

                <Select
                  label="Year"
                  options={yearOptions}
                  placeholder="Select year"
                  required
                  error={errors?.year?.message}
                  value={watch('year')}
                  onChange={(value) => {
                    register('year', { required: 'Please select your year' }).onChange({ target: { name: 'year', value } });
                  }}
                />

                <Select
                  label="Section"
                  options={sectionOptions}
                  placeholder="Select section"
                  required
                  error={errors?.section?.message}
                  value={watch('section')}
                  onChange={(value) => {
                    register('section', { required: 'Please select your section' }).onChange({ target: { name: 'section', value } });
                  }}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  error={errors?.email?.message}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { 
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                  error={errors?.phone?.message}
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: { 
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-border">
              <Button
                type="submit"
                variant="default"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                fullWidth
                iconName="Send"
                iconPosition="right"
              >
                {isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;