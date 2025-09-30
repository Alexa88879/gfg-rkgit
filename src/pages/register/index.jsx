import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../community-feedback-hub/components/Footer';
import { eventService } from '../../utils/eventService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Register = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set page title
    document.title = 'Event Registration - GFG RKGIT';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Register for GFG RKGIT events and workshops. Join our community activities and enhance your skills.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Register for GFG RKGIT events and workshops. Join our community activities and enhance your skills.';
      document.getElementsByTagName('head')?.[0]?.appendChild(meta);
    }

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    fetchEvents();

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const result = await eventService.getActiveEvents();
      if (result.success) {
        setEvents(result.data);
      } else {
        console.error('Error fetching events:', result.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getEventTypeIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    
    // Cloud & AWS Events
    if (lowerTitle.includes('aws')) {
      return 'Cloud';
    }
    else if (lowerTitle.includes('cloud') || lowerTitle.includes('azure') || lowerTitle.includes('gcp')) {
      return 'Cloud';
    }
    // AI/ML Events
    else if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('artificial intelligence')) {
      return 'Brain';
    }
    // Programming & Development
    else if (lowerTitle.includes('python') || lowerTitle.includes('javascript') || lowerTitle.includes('react') || lowerTitle.includes('node') || lowerTitle.includes('programming') || lowerTitle.includes('coding')) {
      return 'Code';
    }
    // Web Development
    else if (lowerTitle.includes('web') || lowerTitle.includes('frontend') || lowerTitle.includes('backend') || lowerTitle.includes('fullstack')) {
      return 'Globe';
    }
    // Database Events
    else if (lowerTitle.includes('database') || lowerTitle.includes('sql') || lowerTitle.includes('mongodb') || lowerTitle.includes('mysql')) {
      return 'Database';
    }
    // Cybersecurity
    else if (lowerTitle.includes('security') || lowerTitle.includes('cyber') || lowerTitle.includes('hacking') || lowerTitle.includes('ethical')) {
      return 'Shield';
    }
    // Data Science
    else if (lowerTitle.includes('data') || lowerTitle.includes('analytics') || lowerTitle.includes('statistics') || lowerTitle.includes('science')) {
      return 'BarChart';
    }
    // Mobile Development
    else if (lowerTitle.includes('mobile') || lowerTitle.includes('android') || lowerTitle.includes('ios') || lowerTitle.includes('flutter')) {
      return 'Smartphone';
    }
    // DevOps
    else if (lowerTitle.includes('devops') || lowerTitle.includes('docker') || lowerTitle.includes('kubernetes') || lowerTitle.includes('ci/cd')) {
      return 'Settings';
    }
    // Blockchain
    else if (lowerTitle.includes('blockchain') || lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('ethereum')) {
      return 'Coins';
    }
    // Competitions & Contests
    else if (lowerTitle.includes('competition') || lowerTitle.includes('contest') || lowerTitle.includes('hackathon') || lowerTitle.includes('challenge')) {
      return 'Trophy';
    }
    // Seminars & Talks
    else if (lowerTitle.includes('seminar') || lowerTitle.includes('talk') || lowerTitle.includes('lecture') || lowerTitle.includes('presentation')) {
      return 'PresentationChart';
    }
    // Career & Placement
    else if (lowerTitle.includes('career') || lowerTitle.includes('placement') || lowerTitle.includes('job') || lowerTitle.includes('interview')) {
      return 'Briefcase';
    }
    // Networking Events
    else if (lowerTitle.includes('networking') || lowerTitle.includes('meetup') || lowerTitle.includes('community')) {
      return 'Users';
    }
    // Workshops (General)
    else if (lowerTitle.includes('workshop')) {
      return 'Wrench';
    }
    // Default
    else {
      return 'Calendar';
    }
  };

  const getEventTypeColor = (title) => {
    const lowerTitle = title.toLowerCase();
    
    // Cloud & AWS Events
    if (lowerTitle.includes('aws')) {
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
    }
    else if (lowerTitle.includes('cloud') || lowerTitle.includes('azure') || lowerTitle.includes('gcp')) {
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    }
    // AI/ML Events
    else if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('artificial intelligence')) {
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
    }
    // Programming & Development
    else if (lowerTitle.includes('python') || lowerTitle.includes('javascript') || lowerTitle.includes('react') || lowerTitle.includes('node') || lowerTitle.includes('programming') || lowerTitle.includes('coding')) {
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    }
    // Web Development
    else if (lowerTitle.includes('web') || lowerTitle.includes('frontend') || lowerTitle.includes('backend') || lowerTitle.includes('fullstack')) {
      return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    }
    // Database Events
    else if (lowerTitle.includes('database') || lowerTitle.includes('sql') || lowerTitle.includes('mongodb') || lowerTitle.includes('mysql')) {
      return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400';
    }
    // Cybersecurity
    else if (lowerTitle.includes('security') || lowerTitle.includes('cyber') || lowerTitle.includes('hacking') || lowerTitle.includes('ethical')) {
      return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    }
    // Data Science
    else if (lowerTitle.includes('data') || lowerTitle.includes('analytics') || lowerTitle.includes('statistics') || lowerTitle.includes('science')) {
      return 'text-teal-600 bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400';
    }
    // Mobile Development
    else if (lowerTitle.includes('mobile') || lowerTitle.includes('android') || lowerTitle.includes('ios') || lowerTitle.includes('flutter')) {
      return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400';
    }
    // DevOps
    else if (lowerTitle.includes('devops') || lowerTitle.includes('docker') || lowerTitle.includes('kubernetes') || lowerTitle.includes('ci/cd')) {
      return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400';
    }
    // Blockchain
    else if (lowerTitle.includes('blockchain') || lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('ethereum')) {
      return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
    }
    // Competitions & Contests
    else if (lowerTitle.includes('competition') || lowerTitle.includes('contest') || lowerTitle.includes('hackathon') || lowerTitle.includes('challenge')) {
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
    // Seminars & Talks
    else if (lowerTitle.includes('seminar') || lowerTitle.includes('talk') || lowerTitle.includes('lecture') || lowerTitle.includes('presentation')) {
      return 'text-violet-600 bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400';
    }
    // Career & Placement
    else if (lowerTitle.includes('career') || lowerTitle.includes('placement') || lowerTitle.includes('job') || lowerTitle.includes('interview')) {
      return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400';
    }
    // Networking Events
    else if (lowerTitle.includes('networking') || lowerTitle.includes('meetup') || lowerTitle.includes('community')) {
      return 'text-sky-600 bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400';
    }
    // Workshops (General)
    else if (lowerTitle.includes('workshop')) {
      return 'text-slate-600 bg-slate-100 dark:bg-slate-900/20 dark:text-slate-400';
    }
    // Default
    else {
      return 'text-primary bg-primary/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-16 lg:pt-18">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 lg:pt-18">
        {/* Events Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {events.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/10 rounded-full mb-6">
                  <Icon name="Calendar" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  No Events Available
                </h3>
                <p className="text-muted-foreground mb-8">
                  There are currently no active events available for registration. 
                  Check back later for new events and workshops.
                </p>
                <Link to="/">
                  <Button variant="outline" iconName="Home">
                    Go to Home
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {events.map((event) => {
                    const isFull = event.currentParticipants >= event.maxParticipants;
                    const remainingSeats = event.maxParticipants - event.currentParticipants;
                    
                    return (
                      <div key={event.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-lg transition-smooth max-w-sm mx-auto h-fit">
                        {/* Header with Icon and Status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-md ${getEventTypeColor(event.title)} flex-shrink-0`}>
                              <Icon name={getEventTypeIcon(event.title)} size={16} />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isFull 
                                ? 'text-error bg-error/10' 
                                : 'text-success bg-success/10'
                            }`}>
                              {isFull ? 'Full' : `${remainingSeats} seats left`}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-foreground leading-tight mb-2 break-words">
                          {event.title}
                        </h3>

                        {/* Instructor */}
                        {event.instructor && (
                          <div className="mb-3">
                            <p className="text-sm text-muted-foreground break-words">
                              <span className="font-medium">Instructor:</span> {event.instructor}
                            </p>
                          </div>
                        )}

                        {/* Description */}
                        <div className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed whitespace-pre-line">
                          {event.description}
                        </div>

                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Calendar" size={16} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground flex-shrink-0">Date:</span>
                            <span className="text-foreground truncate" title={formatDate(event.date)}>
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Clock" size={16} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground flex-shrink-0">Time:</span>
                            <span className="text-foreground truncate" title={event.time}>
                              {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="MapPin" size={16} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground flex-shrink-0">Location:</span>
                            <span className="text-foreground truncate" title={event.location}>
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Users" size={16} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground flex-shrink-0">Participants:</span>
                            <span className="text-foreground">
                              {event.currentParticipants || 0}/{event.maxParticipants}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/register/${event.id}`} className="flex-1">
                            <Button 
                              variant={isFull ? "outline" : "default"}
                              size="sm"
                              fullWidth
                              disabled={isFull}
                              iconName={isFull ? "X" : "UserPlus"}
                            >
                              {isFull ? 'Registration Closed' : 'Register Now'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;
