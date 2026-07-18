import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Github, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <Lightbulb className="logo-icon-sm" />
              <span className="logo-text-footer">StartupValidator</span>
            </Link>
            <p className="footer-desc">
              Validate your startup ideas with honest feedback from a community of builders and founders.
            </p>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <Github className="icon-sm" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                <Twitter className="icon-sm" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <Linkedin className="icon-sm" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="footer-links-col">
            <h3 className="footer-heading">Product</h3>
            <a href="#" className="footer-link">Features</a>
            <Link to="/register" className="footer-link">Get Started</Link>
          </div>

          {/* Resources */}
          <div className="footer-links-col">
            <h3 className="footer-heading">Resources</h3>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">Community</a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} StartupValidator. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#" className="footer-legal-link">Privacy</a>
            <a href="#" className="footer-legal-link">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;