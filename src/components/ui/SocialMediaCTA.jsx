import React from 'react';
import Icon from '../AppIcon';

const SocialMediaCTA = ({ variant = 'hero', className = '' }) => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      url: 'https://chat.whatsapp.com/Jmoa8pVSDL04aeb8zD0Kig?mode=ac_t',
      color: 'text-green-600',
      hoverColor: 'hover:bg-green-50 dark:hover:bg-green-900/20'
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      url: 'https://www.linkedin.com/company/geeksforgeeks-campus-body-rkgit/',
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Instagram',
      icon: 'Instagram',
      url: 'https://www.instagram.com/gfg_rkgit?igsh=MWhpdTVxaDZlYmNleg==',
      color: 'text-pink-600',
      hoverColor: 'hover:bg-pink-50 dark:hover:bg-pink-900/20'
    }
  ];

  const handleSocialClick = (url, platform) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
        {socialLinks?.map((social) => (
          <button
            key={social?.name}
            onClick={() => handleSocialClick(social?.url, social?.name)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border border-border
              bg-card text-card-foreground transition-quick social-glow
              hover:scale-105 hover:border-secondary/50
              ${social?.hoverColor}
            `}
            title={`Join us on ${social?.name}`}
          >
            <Icon name={social?.icon} size={18} className={social?.color} />
            <span className="text-sm font-medium">{social?.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Connect with GFG RKGIT Community
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Join our vibrant community across multiple platforms. Get updates, participate in discussions, 
        and connect with fellow developers.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {socialLinks?.map((social) => (
          <button
            key={social?.name}
            onClick={() => handleSocialClick(social?.url, social?.name)}
            className={`
              group flex flex-col items-center p-6 rounded-xl border border-border
              bg-card text-card-foreground transition-quick social-glow elevation-1
              hover:scale-105 hover:border-secondary/50 hover:elevation-2
              ${social?.hoverColor}
            `}
            title={`Join us on ${social?.name}`}
          >
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full mb-3
              bg-muted group-hover:bg-secondary/20 transition-quick
            `}>
              <Icon 
                name={social?.icon} 
                size={24} 
                className={`${social?.color} group-hover:scale-110 transition-quick`} 
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {social?.name}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Join Community
            </span>
          </button>
        ))}
      </div>
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Users" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">20+ Active Members</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Join discussions, get help, and stay updated with the latest events and opportunities
        </p>
      </div>
    </div>
  );
};

export default SocialMediaCTA;