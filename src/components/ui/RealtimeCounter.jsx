import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { db } from '../../firebase';
import { collection, query, onSnapshot, getDocs } from 'firebase/firestore';

const RealtimeCounter = () => {
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get real-time feedback count from Firebase
  useEffect(() => {
    // Initial fetch
    const fetchInitialCount = async () => {
      try {
        const feedbackRef = collection(db, 'feedback');
        const snapshot = await getDocs(feedbackRef);
        setFeedbackCount(snapshot.size);
      } catch (error) {
        console.error('Error fetching feedback count:', error);
      }
    };
    
    fetchInitialCount();
    
    // Set up real-time listener
    const feedbackRef = collection(db, 'feedback');
    const q = query(feedbackRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeedbackCount(snapshot.size);
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <Icon name="BarChart3" size={32} className="text-primary" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Community Impact
        </h2>
        
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join hundreds of GFG RKGIT members who have already shared their valuable feedback 
          to help improve our community events and initiatives.
        </p>

        {/* Counter Display */}
        <div className={`
          inline-block p-8 rounded-2xl bg-card border border-border elevation-2 transition-smooth
          ${isAnimating ? 'pulse-glow' : 'glow-animation'}
        `}>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold font-mono text-primary mb-2">
                {feedbackCount?.toLocaleString()}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                Feedback Submissions
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-border mx-6" />
            
            <div className="hidden sm:block text-center">
              <div className="text-2xl md:text-3xl font-bold text-success mb-2">
                98%
              </div>
              <div className="text-sm text-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
          </div>
          
          {/* Live Indicator */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">
              Live Updates
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-xl font-semibold text-foreground">3</div>
            <div className="text-xs text-muted-foreground">Events Covered</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-xl font-semibold text-foreground">20+</div>
            <div className="text-xs text-muted-foreground">Active Members</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-xl font-semibold text-foreground">24/7</div>
            <div className="text-xs text-muted-foreground">Support</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-xl font-semibold text-foreground">100%</div>
            <div className="text-xs text-muted-foreground">Anonymous</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeCounter;