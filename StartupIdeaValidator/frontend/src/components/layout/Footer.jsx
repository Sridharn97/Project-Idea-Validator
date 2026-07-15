import React from 'react';
import { Lightbulb, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <Lightbulb className="logo-icon-sm" />
              <span className="logo-text-footer">StartupValidator</span>
            </div>
            <p className="footer-desc">
              Validate your startup ideas with honest feedback from our community of innovators.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/startupvalidator" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <Github className="icon-sm" />
              </a>
              <a href="https://twitter.com/startupvalidator" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                <Twitter className="icon-sm" />
              </a>
              <a href="https://linkedin.com/company/startupvalidator" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <Linkedin className="icon-sm" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="footer-links-col">
            <h3 className="footer-heading">Product</h3>
            <a href="#" className="footer-link">Features</a>
            <a href="#" className="footer-link">Pricing</a>
            <a href="#" className="footer-link">Examples</a>
            <a href="#" className="footer-link">Updates</a>
          </div>

          {/* Links Column 2 */}
          <div className="footer-links-col">
            <h3 className="footer-heading">Resources</h3>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Guides</a>
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">API Status</a>
          </div>

          {/* Newsletter Column */}
          <div className="footer-newsletter-col">
            <h3 className="footer-heading">Stay Updated</h3>
            <p className="footer-desc">
              Subscribe to our newsletter for the latest tips and updates.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" className="newsletter-input" />
              <button className="newsletter-btn">
                <Mail className="icon-sm" />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} StartupValidator. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#" className="footer-legal-link">Privacy Policy</a>
            <a href="#" className="footer-legal-link">Terms of Service</a>
            <a href="#" className="footer-legal-link">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;