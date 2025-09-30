import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import ContactSection from '../community-feedback-hub/components/ContactSection';
import Footer from '../community-feedback-hub/components/Footer';
import Icon from '../../components/AppIcon';

const Contact = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Contact Us - GFG RKGIT';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Get in touch with the GFG RKGIT team. Find our contact information, location, and ways to connect with us.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Get in touch with the GFG RKGIT team. Find our contact information, location, and ways to connect with us.';
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
              <Icon name="Mail" size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you. 
              Reach out to the GFG RKGIT team and let's build something amazing together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Quick Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Multiple Channels</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Community Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Email */}
              <div className="bg-card rounded-2xl border border-border p-8 text-center elevation-1 hover:elevation-2 transition-smooth">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Icon name="Mail" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Email Us</h3>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a 
                  href="mailto:gfg_cse@rkgit.edu.in"
                  className="text-primary hover:text-primary/80 font-medium transition-smooth"
                >
                  gfg_cse@rkgit.edu.in
                </a>
              </div>

              {/* Phone */}
              <div className="bg-card rounded-2xl border border-border p-8 text-center elevation-1 hover:elevation-2 transition-smooth">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-6">
                  <Icon name="Phone" size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Call Us</h3>
                <p className="text-muted-foreground mb-4">
                  Reach out to us directly for immediate assistance.
                </p>
                <a 
                  href="tel:+919876543210"
                  className="text-secondary hover:text-secondary/80 font-medium transition-smooth"
                >
                  +91 8279680962
                </a>
              </div>

              {/* Location */}
              <div className="bg-card rounded-2xl border border-border p-8 text-center elevation-1 hover:elevation-2 transition-smooth">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <Icon name="MapPin" size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Visit Us</h3>
                <p className="text-muted-foreground mb-4">
                  Find us at our campus location in Ghaziabad.
                </p>
                <p className="text-accent font-medium">
                  Raj Kumar Goel Institute<br />
                  Of Technology, Ghaziabad
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;