import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import CareerForm from './components/CareerForm';
import Footer from '../community-feedback-hub/components/Footer';

const CareerApplication = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Career Application - GFG RKGIT';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Apply to join the GeeksforGeeks RKGIT Campus Body. Share your skills, passion, and commitment to become part of our tech community.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Apply to join the GeeksforGeeks RKGIT Campus Body. Share your skills, passion, and commitment to become part of our tech community.';
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
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path
                  d="M20 4L24 12H32L26 18L28 26L20 22L12 26L14 18L8 12H16L20 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join the GFG Campus Body
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Ready to make an impact? Apply to become part of the GeeksforGeeks RKGIT Campus Body 
              and help shape the future of our tech community. Share your passion, skills, and commitment 
              to join our dynamic team.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Domain Expertise</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Community Impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Leadership Growth</span>
              </div>
            </div>
          </div>
        </section>

        {/* Career Form */}
        <CareerForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CareerApplication;