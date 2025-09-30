import React from 'react';
import Icon from '../../../components/AppIcon';
import SocialMediaCTA from '../../../components/ui/SocialMediaCTA';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Feedback', href: '/feedback' },
    { label: 'Career', href: '/career' },
    { label: 'Contact', href: '/contact' }
  ];


  const supportLinks = [
    { label: 'Help Center', href: '#' },
    { label: 'Community Guidelines', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Report Issue', href: '#' }
  ];

  const handleLinkClick = (href) => {
    if (href?.startsWith('/')) {
      window.location.href = href;
    }
  };

  const currentYear = new Date()?.getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex-shrink-0">
                  <img
                    src="/favicon.jpg"
                    alt="GFG RKGIT Logo"
                    width="40"
                    height="40"
                    className="rounded-lg transition-smooth"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">GFG RKGIT</h3>
                  <p className="text-sm text-muted-foreground">Community Portal</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Building a stronger tech community at RKGIT through collaborative learning,
                skill development, and meaningful connections. Join us in shaping the future of technology.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Icon name="Mail" size={16} />
                  <span>gfg_cse@rkgit.edu.in</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Icon name="Phone" size={16} />
                  <span>+91 8279680962</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Icon name="MapPin" size={16} />
                  <span>28.7002° N, 77.4419° E<br />Raj Kumar Goel Institute Of Technology, Ghaziabad</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks?.map((link) => (
                  <li key={link?.label}>
                    <button
                      onClick={() => handleLinkClick(link?.href)}
                      className="text-muted-foreground hover:text-primary transition-smooth text-sm"
                    >
                      {link?.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>


            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6">Support</h4>
              <ul className="space-y-3">
                {supportLinks?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-muted-foreground hover:text-primary transition-smooth text-sm"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center mb-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">Stay Connected</h4>
              <p className="text-muted-foreground mb-6">
                Follow us on social media for updates, events, and community highlights
              </p>
            </div>
            <SocialMediaCTA variant="footer" className="justify-center" />
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="max-w-md mx-auto text-center">
              <h4 className="text-lg font-semibold text-foreground mb-4">Stay Updated</h4>
              <p className="text-muted-foreground mb-6 text-sm">
                Get notified about upcoming events, workshops, and community updates
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-muted-foreground">
                © {currentYear} GFG RKGIT . All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4 text-xs text-muted-foreground">
                <a href="#" className="hover:text-primary transition-smooth">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-smooth">Terms</a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-smooth">Cookies</a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Heart" size={14} className="text-error" />
                <span>Made with love by GFG RKGIT Team</span>
              </div>
            </div>
          </div>

          {/* Mobile Links */}
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-smooth">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;