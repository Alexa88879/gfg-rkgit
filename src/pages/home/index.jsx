import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import RealtimeCounter from '../../components/ui/RealtimeCounter';
import HeroSection from '../community-feedback-hub/components/HeroSection';
import ContactSection from '../community-feedback-hub/components/ContactSection';
import Footer from '../community-feedback-hub/components/Footer';

const Home = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Home - GFG RKGIT';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Welcome to GeeksforGeeks RKGIT Portal. Join our tech community, participate in events, and grow your programming skills.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Welcome to GeeksforGeeks RKGIT Portal. Join our tech community, participate in events, and grow your programming skills.';
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

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;