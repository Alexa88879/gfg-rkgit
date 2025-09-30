import React from 'react';
import Icon from '../../../components/AppIcon';
import SocialMediaCTA from '../../../components/ui/SocialMediaCTA';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Icon name="Users" size={16} className="text-primary mr-2" />
            <span className="text-sm font-medium text-primary">GFG @ RKGIT Community</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Your Voice Shapes Our
            <span className="block text-primary glow-animation">Community</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the GeeksforGeeks RKGIT chapter in building a stronger tech community. 
            Share your feedback on events, workshops, and initiatives to help us create 
            better experiences for everyone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => window.location.href = '/feedback'}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg transition-smooth hover:scale-105 hover:bg-primary/90 elevation-2 hover:elevation-3"
            >
              <Icon name="MessageSquare" size={20} className="inline mr-2" />
              Share Your Feedback
            </button>
            
            <button
              onClick={() => document.getElementById('counter')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-card text-card-foreground border border-border rounded-xl font-semibold text-lg transition-smooth hover:scale-105 hover:bg-muted elevation-1 hover:elevation-2"
            >
              <Icon name="BarChart3" size={20} className="inline mr-2" />
              View Impact
            </button>
          </div>

          {/* Social Media CTA */}
          <div className="max-w-4xl mx-auto">
            <SocialMediaCTA variant="hero" />
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Icon name="ChevronDown" size={24} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;