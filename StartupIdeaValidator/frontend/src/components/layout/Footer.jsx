import React from 'react';
import { Lightbulb, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <Lightbulb className="h-6 w-6 text-blue-400 mr-2" />
              <span className="font-bold text-xl text-white">StartupValidator</span>
            </div>
            <p className="text-sm">
              Validate your startup ideas with honest feedback from our community of innovators.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/startupvalidator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/startupvalidator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/startupvalidator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-2">
              Product
            </h3>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              Features
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              Pricing
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              Examples
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              Updates
            </a>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-2">
              Resources
            </h3>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              Blog
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              Guides
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              Help Center
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              API Status
            </a>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-2">
              Stay Updated
            </h3>
            <p className="text-sm">
              Subscribe to our newsletter for the latest tips and updates.
            </p>
            <div className="flex mt-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors duration-200">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-xs mb-4 md:mb-0">
            &copy; {currentYear} StartupValidator. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors duration-200">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;