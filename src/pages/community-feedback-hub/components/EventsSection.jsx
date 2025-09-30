import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EventsSection = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "DSA Workshop Series",
      date: "2025-01-15",
      time: "10:00 AM - 4:00 PM",
      location: "Computer Lab 1",
      type: "Workshop",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
      description: "Comprehensive Data Structures and Algorithms workshop covering arrays, linked lists, trees, and graph algorithms.",
      registrations: 45,
      maxCapacity: 60
    },
    {
      id: 2,
      title: "Web Development Bootcamp",
      date: "2025-01-22",
      time: "9:00 AM - 5:00 PM",
      location: "Auditorium",
      type: "Bootcamp",
      image: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?w=400&h=250&fit=crop",
      description: "Full-stack web development bootcamp covering React, Node.js, MongoDB, and deployment strategies.",
      registrations: 78,
      maxCapacity: 80
    },
    {
      id: 3,
      title: "Competitive Programming Contest",
      date: "2025-01-28",
      time: "2:00 PM - 6:00 PM",
      location: "Online Platform",
      type: "Contest",
      image: "https://images.pixabay.com/photo/2016/11/30/20/58/programming-1873854_1280.jpg?w=400&h=250&fit=crop",
      description: "Monthly coding contest with prizes for top performers. Test your problem-solving skills!",
      registrations: 120,
      maxCapacity: 150
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      date: "2024-12-15",
      attendees: 65,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Git & GitHub Workshop",
      date: "2024-12-08",
      attendees: 52,
      rating: 4.9,
      image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=400&h=250&fit=crop"
    }
  ];

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Workshop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Bootcamp': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Contest': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="events" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
            <Icon name="Calendar" size={32} className="text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Community Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our exciting events, workshops, and competitions designed to enhance your technical skills 
            and connect with fellow developers in the GFG RKGIT community.
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-foreground">Upcoming Events</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>Next 30 days</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents?.map((event) => (
              <div key={event?.id} className="bg-card rounded-xl border border-border elevation-1 hover:elevation-2 transition-smooth overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event?.image}
                    alt={event?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event?.type)}`}>
                      {event?.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-xs font-medium text-foreground">{formatDate(event?.date)}</div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-2">{event?.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event?.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Icon name="Clock" size={14} className="mr-2" />
                      <span>{event?.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} className="mr-2" />
                      <span>{event?.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {event?.registrations}/{event?.maxCapacity} registered
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-smooth">
                      Register
                    </button>
                  </div>

                  {/* Registration Progress */}
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-smooth"
                        style={{ width: `${(event?.registrations / event?.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-foreground">Recent Events</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="History" size={16} />
              <span>Past 30 days</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents?.map((event) => (
              <div key={event?.id} className="bg-card rounded-xl border border-border elevation-1 overflow-hidden">
                <div className="flex">
                  <div className="w-32 h-24 flex-shrink-0 overflow-hidden">
                    <Image
                      src={event?.image}
                      alt={event?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="font-semibold text-foreground mb-1">{event?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{formatDate(event?.date)}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Users" size={14} />
                          <span>{event?.attendees} attended</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={14} className="text-warning fill-current" />
                          <span>{event?.rating}</span>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary/80 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-border">
            <Icon name="Calendar" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Don't Miss Out on Future Events
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Stay updated with our latest events, workshops, and competitions. 
              Join our community channels for instant notifications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth">
                Join WhatsApp Group
              </button>
              <button className="px-6 py-3 bg-card text-card-foreground border border-border rounded-lg font-medium hover:bg-muted transition-smooth">
                Follow on Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;