import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-primary tracking-tight">MeterOps</span>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              The complete infrastructure for metering, billing, and tenant management.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-gray-600"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-600"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-600"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Features</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Integrations</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">API Reference</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Guides</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary">Legal</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MeterOps Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
