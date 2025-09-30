import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import RealtimeCounter from '../../components/ui/RealtimeCounter';
import HeroSection from './components/HeroSection';
import FeedbackForm from './components/FeedbackForm';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

const CommunityFeedbackHub = () => {
  useEffect(() => {
    // Set page title
    document.title = 'GFG RKGIT';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Join the GeeksforGeeks RKGIT . Share your experience, connect with fellow developers, and help shape our tech community.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Join the GeeksforGeeks RKGIT. Share your experience, connect with fellow developers, and help shape our tech community.';
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
        <HeroSection />

        {/* Real-time Counter Section */}
        <section id="counter" className="py-20 bg-background">
          <RealtimeCounter />
        </section>

        {/* Feedback Form */}
        <FeedbackForm />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CommunityFeedbackHub;