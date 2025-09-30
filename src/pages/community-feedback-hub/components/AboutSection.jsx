import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AboutSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Arjun Sharma",
      role: "Chapter Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Final year CSE student passionate about competitive programming and community building.",
      skills: ["Leadership", "DSA", "Web Development"],
      social: {
        linkedin: "https://linkedin.com/in/arjun-sharma",
        github: "https://github.com/arjun-sharma"
      }
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Technical Lead",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Expert in full-stack development with experience in organizing technical workshops.",
      skills: ["React", "Node.js", "Documentation"],
      social: {
        linkedin: "https://linkedin.com/in/priya-patel",
        github: "https://github.com/priya-patel"
      }
    },
    {
      id: 3,
      name: "Rohit Kumar",
      role: "Event Coordinator",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Specializes in management and community engagement with strong organizational skills.",
      skills: ["Management", "Public Speaking", "Marketing"],
      social: {
        linkedin: "https://linkedin.com/in/rohit-kumar",
        github: "https://github.com/rohit-kumar"
      }
    },
    {
      id: 4,
      name: "Sneha Gupta",
      role: "Content Creator",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Creates educational content and manages social media presence for the chapter.",
      skills: ["Documentation", "Social Media", "Video Editing"],
      social: {
        linkedin: "https://linkedin.com/in/sneha-gupta",
        github: "https://github.com/sneha-gupta"
      }
    }
  ];

  const achievements = [
    {
      icon: "Trophy",
      title: "Best Chapter Award 2024",
      description: "Recognized as the most active GFG chapter in North India"
    },
    {
      icon: "Users",
      title: "500+ Active Members",
      description: "Growing community of passionate developers and learners"
    },
    {
      icon: "Calendar",
      title: "50+ Events Organized",
      description: "Successfully conducted workshops, contests, and seminars"
    },
    {
      icon: "Award",
      title: "95% Satisfaction Rate",
      description: "Consistently high ratings from event participants"
    }
  ];

  const values = [
    {
      icon: "Heart",
      title: "Community First",
      description: "We prioritize building a supportive and inclusive environment where everyone can learn and grow together."
    },
    {
      icon: "Lightbulb",
      title: "Innovation & Learning",
      description: "We encourage creative thinking, continuous learning, and staying updated with the latest technologies."
    },
    {
      icon: "Users",
      title: "Collaboration",
      description: "We believe in the power of teamwork and knowledge sharing to achieve greater success."
    },
    {
      icon: "Target",
      title: "Excellence",
      description: "We strive for excellence in everything we do, from organizing events to supporting our members."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Icon name="Info" size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About GFG RKGIT
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            We are the official GeeksforGeeks student chapter at RKGIT, dedicated to fostering 
            a vibrant community of developers, programmers, and tech enthusiasts.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-card rounded-2xl border border-border p-8 elevation-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Icon name="Target" size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Our Mission</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To create an inclusive learning environment where students can enhance their programming skills, 
              participate in competitive coding, and build meaningful connections with fellow developers. 
              We aim to bridge the gap between academic learning and industry requirements through 
              practical workshops, coding contests, and mentorship programs.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 elevation-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                <Icon name="Eye" size={24} className="text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Our Vision</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become the leading student tech community that empowers the next generation of software 
              engineers and innovators. We envision a future where every member of our chapter is 
              well-equipped with both technical skills and soft skills necessary to excel in their 
              careers and contribute meaningfully to the tech industry.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values?.map((value, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-xl border border-border hover:elevation-1 transition-smooth">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={value?.icon} size={28} className="text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">{value?.title}</h4>
                <p className="text-sm text-muted-foreground">{value?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-12">Our Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements?.map((achievement, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={achievement?.icon} size={28} className="text-success" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{achievement?.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-12">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers?.map((member) => (
              <div key={member?.id} className="bg-card rounded-xl border border-border overflow-hidden elevation-1 hover:elevation-2 transition-smooth">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={member?.image}
                    alt={member?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-1">{member?.name}</h4>
                  <p className="text-primary text-sm font-medium mb-3">{member?.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member?.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member?.skills?.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <a
                      href={member?.social?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      <Icon name="Linkedin" size={16} />
                    </a>
                    <a
                      href={member?.social?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      <Icon name="Github" size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-border text-center">
          <Icon name="Users" size={48} className="text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Ready to Join Our Community?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a beginner looking to learn programming or an experienced developer wanting to share knowledge, there's a place for you in our community. Join us today 
            and be part of something amazing!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-smooth">
              Join WhatsApp Group
            </button>
            <button className="px-8 py-3 bg-card text-card-foreground border border-border rounded-lg font-semibold hover:bg-muted transition-smooth">
              Follow on Social Media
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;