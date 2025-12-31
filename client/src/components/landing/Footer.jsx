import { useState } from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import ContactModal from './ContactModal';

const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-bold text-primary tracking-tight">MeterOps</span>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs">
                The complete infrastructure for metering, billing, and tenant management.
                Built for developers, by developers.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-gray-600 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-600 hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary transition-colors">How it Works</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setIsContactOpen(true)}
                    className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    Contact Us
                  </button>
                </li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MeterOps Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Footer;
