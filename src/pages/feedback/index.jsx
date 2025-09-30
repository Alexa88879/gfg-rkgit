import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import FeedbackForm from '../community-feedback-hub/components/FeedbackForm';
import Footer from '../community-feedback-hub/components/Footer';
import Icon from '../../components/AppIcon';

const Feedback = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Feedback - GFG RKGIT';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Share your feedback about GFG RKGIT events and activities. Help us improve our community experience.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Share your feedback about GFG RKGIT events and activities. Help us improve our community experience.';
      document.getElementsByTagName('head')?.[0]?.appendChild(meta);
    }

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 lg:pt-18">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8">
              <Icon name="MessageSquare" size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Share Your Feedback
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Your feedback is invaluable to us. Help us improve our events, activities, and 
              community experience by sharing your honest thoughts and suggestions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Event Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Content Relevance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Community Impact</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Form */}
        <FeedbackForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Feedback;