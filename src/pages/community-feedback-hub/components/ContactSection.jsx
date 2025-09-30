import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const contactInfo = [
    {
      icon: "Mail",
      title: "Email Us",
      details: "gfg_cse@rkgit.edu.in",
      description: "Send us your queries and we\'ll respond within 24 hours"
    },
    {
      icon: "Phone",
      title: "Call Us",
      details: "+91 82796 80962",
      description: "Available Monday to Friday, 9 AM - 6 PM"
    },
    {
      icon: "MapPin",
      title: "Visit Us",
      details: "28.7002° N, 77.4419° E",
      description: "Raj Kumar Goel Institute Of Technology, Ghaziabad"
    },
    {
      icon: "Clock",
      title: "Office Hours",
      details: "Mon - Fri: 9 AM - 6 PM",
      description: "Weekend events and workshops as scheduled"
    }
  ];

  const socialLinks = [
    { name: "WhatsApp", icon: "MessageCircle", url: "https://chat.whatsapp.com/Jmoa8pVSDL04aeb8zD0Kig?mode=ac_t", color: "text-green-600" },
    { name: "Instagram", icon: "Instagram", url: "https://www.instagram.com/gfg_rkgit?igsh=MWhpdTVxaDZlYmNleg==", color: "text-pink-600" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://www.linkedin.com/company/geeksforgeeks-campus-body-rkgit/", color: "text-blue-600" }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const contactData = {
        ...data,
        timestamp: new Date()?.toISOString(),
        messageId: Math.random()?.toString(36)?.substr(2, 9)
      };

      console.log('Contact form submitted:', contactData);
      
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
      <section id="contact" className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6 pulse-glow">
            <Icon name="CheckCircle" size={40} className="text-success" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Message Sent Successfully!
          </h3>
          <p className="text-muted-foreground mb-8">
            Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowSuccess(false)}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Send Another Message
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
            <Icon name="Mail" size={32} className="text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions, suggestions, or want to collaborate with us? We'd love to hear from you. 
            Reach out through any of the channels below or send us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo?.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-card rounded-xl border border-border">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={info?.icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{info?.title}</h4>
                      <p className="text-primary font-medium mb-1">{info?.details}</p>
                      <p className="text-sm text-muted-foreground">{info?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Connect With Us</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks?.map((social) => (
                  <a
                    key={social?.name}
                    href={social?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-card rounded-xl border border-border hover:elevation-1 transition-smooth group"
                  >
                    <Icon name={social?.icon} size={20} className={`${social?.color} group-hover:scale-110 transition-smooth`} />
                    <span className="font-medium text-foreground">{social?.name}</span>
                    <Icon name="ExternalLink" size={14} className="text-muted-foreground ml-auto" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Find Us</h3>
              <div className="bg-card rounded-xl border border-border overflow-hidden h-64">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="RKGIT Campus Location"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=28.7002,77.4419&z=15&output=embed"
                  className="border-0"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl border border-border p-8 elevation-1">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="Enter your first name"
                  required
                  error={errors?.firstName?.message}
                  {...register('firstName', { 
                    required: 'First name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />

                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Enter your last name"
                  required
                  error={errors?.lastName?.message}
                  {...register('lastName', { 
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
              </div>

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
                error={errors?.phone?.message}
                {...register('phone', { 
                  pattern: { 
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                })}
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject <span className="text-error">*</span>
                </label>
                <select
                  {...register('subject', { required: 'Please select a subject' })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="event">Event Related</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="feedback">Feedback</option>
                  <option value="design">Design Support</option>
                  <option value="documentation">Documentation Help</option>
                </select>
                {errors?.subject && (
                  <p className="mt-1 text-sm text-error">{errors?.subject?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  {...register('message', { 
                    required: 'Please enter your message',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' }
                  })}
                  rows={5}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                  placeholder="Tell us how we can help you..."
                />
                {errors?.message && (
                  <p className="mt-1 text-sm text-error">{errors?.message?.message}</p>
                )}
              </div>

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
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Your Privacy Matters</span>
              </div>
              <p className="text-xs text-muted-foreground">
                We respect your privacy and will never share your information with third parties. 
                Your data is secure and used only to respond to your inquiry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;