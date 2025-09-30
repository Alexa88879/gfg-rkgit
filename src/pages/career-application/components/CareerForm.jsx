import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CareerForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const yearOptions = [
    { value: '2nd', label: '2nd Year' }
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
    ];

  const domainOptions = [
    { value: 'Designing', label: 'Designing' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Documentation', label: 'Documentation' },
    { value: 'Video Editor', label: 'Video Editor' },
    { value: 'Management', label: 'Management' }
  ];

  const timeCommitmentOptions = [
    { value: '1-3 hours', label: '1-3 hours' },
    { value: '4-6 hours', label: '4-6 hours' },
    { value: '7-10 hours', label: '7-10 hours' },
    { value: '10+ hours', label: '10+ hours' }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const applicationData = {
        ...data,
        timestamp: new Date().toISOString(),
        submissionId: Math.random().toString(36).substr(2, 9),
        status: 'pending'
      };

      // Submit to Firebase
      const docRef = await addDoc(collection(db, "career-applications"), applicationData);
      console.log('Career application submitted with ID:', docRef.id);
      
      setShowSuccess(true);
      reset();

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6 pulse-glow">
            <Icon name="CheckCircle" size={40} className="text-success" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Application Submitted Successfully!
          </h3>
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in joining the GFG RKGIT Campus Body. 
            We have received your application and will review it carefully. 
            You'll hear from us soon regarding the next steps.
          </p>
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h4 className="font-semibold text-foreground mb-2">What's Next?</h4>
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li>• Application review by our team (3-5 business days)</li>
              <li>• Shortlisted candidates will be contacted for interview</li>
              <li>• Final selection and onboarding process</li>
            </ul>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">Join our community:</p>
              <a
                href="https://chat.whatsapp.com/F4OKh7POVGh6tlb91l5Axn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-smooth text-sm"
              >
                <Icon name="MessageCircle" size={16} />
                <span>Join WhatsApp Group</span>
              </a>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSuccess(false)}
            iconName="Plus"
            iconPosition="left"
          >
            Submit Another Application
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="career-form" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Icon name="Users" size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Career Application Form
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fill out this comprehensive application to join our dynamic team. 
            We're looking for passionate individuals ready to make a difference.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border elevation-2 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                  error={errors?.contactNumber?.message}
                  {...register('contactNumber', { 
                    required: 'Contact number is required',
                    pattern: { 
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
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
                    pattern: { value: /^[0-9A-Za-z]+$/, message: 'Roll number should contain only alphanumeric characters' }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Branch"
                  options={departmentOptions}
                  placeholder="Select branch"
                  required
                  error={errors?.branch?.message}
                  value={watch('branch')}
                  onChange={(value) => {
                    register('branch', { required: 'Please select your branch' }).onChange({ target: { name: 'branch', value } });
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

                <Select
                  label="Year of Study"
                  options={yearOptions}
                  placeholder="Select year"
                  required
                  error={errors?.yearOfStudy?.message}
                  value={watch('yearOfStudy')}
                  onChange={(value) => {
                    register('yearOfStudy', { required: 'Please select your year of study' }).onChange({ target: { name: 'yearOfStudy', value } });
                  }}
                />
              </div>
            </div>

            {/* Application Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Application Questions
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What skills, strengths, or experiences can you bring to the GFG Campus Body? <span className="text-error">*</span>
                </label>
                <textarea
                  {...register('skills', { 
                    required: 'Please describe your skills and experiences',
                    minLength: { value: 50, message: 'Please provide at least 50 characters' }
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                  placeholder="Describe your technical skills, leadership experience, projects, achievements, or any other relevant strengths..."
                />
                {errors?.skills && (
                  <p className="mt-1 text-sm text-error">{errors?.skills?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Why do you want to join the GFG Campus Body? <span className="text-error">*</span>
                </label>
                <textarea
                  {...register('motivation', { 
                    required: 'Please share your motivation',
                    minLength: { value: 50, message: 'Please provide at least 50 characters' }
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                  placeholder="Share your passion for technology, community building, learning goals, or how you want to contribute..."
                />
                {errors?.motivation && (
                  <p className="mt-1 text-sm text-error">{errors?.motivation?.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Select
                  label="Which domain interests you the most?"
                  options={domainOptions}
                  placeholder="Select domain"
                  required
                  error={errors?.domainInterest?.message}
                  value={watch('domainInterest')}
                  onChange={(value) => {
                    register('domainInterest', { required: 'Please select your domain interest' }).onChange({ target: { name: 'domainInterest', value } });
                  }}
                />

                <Select
                  label="How much time can you dedicate weekly to GFG activities?"
                  options={timeCommitmentOptions}
                  placeholder="Select time commitment"
                  required
                  error={errors?.timeCommitment?.message}
                  value={watch('timeCommitment')}
                  onChange={(value) => {
                    register('timeCommitment', { required: 'Please select your time commitment' }).onChange({ target: { name: 'timeCommitment', value } });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Have you been part of any clubs/societies/committees before? If yes, mention your role.
                </label>
                <textarea
                  {...register('previousExperience')}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                  placeholder="Describe your previous involvement in clubs, societies, committees, or leadership roles. If none, you can mention 'No previous experience'..."
                />
              </div>
            </div>

            {/* Optional Professional Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Professional Links <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="LinkedIn Profile"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  error={errors?.linkedin?.message}
                  {...register('linkedin', { 
                    pattern: { 
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />

                <Input
                  label="GitHub Profile"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  error={errors?.github?.message}
                  {...register('github', { 
                    pattern: { 
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />

                <Input
                  label="Portfolio Website"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  error={errors?.portfolio?.message}
                  {...register('portfolio', { 
                    pattern: { 
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />
              </div>
            </div>

            {/* Community Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="MessageCircle" size={24} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">Join Our Community</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with fellow applicants and current GFG RKGIT members. Get updates, 
                    ask questions, and be part of our growing tech community.
                  </p>
                  <a
                    href="https://chat.whatsapp.com/F4OKh7POVGh6tlb91l5Axn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-smooth text-sm font-medium"
                  >
                    <Icon name="MessageCircle" size={16} />
                    <span>Join WhatsApp Group</span>
                    <Icon name="ExternalLink" size={14} />
                  </a>
                </div>
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
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                After submitting this application, We will review your application.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CareerForm;