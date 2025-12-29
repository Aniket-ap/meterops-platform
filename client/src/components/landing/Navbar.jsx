import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={clsx(
      "fixed w-full z-50 transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-primary tracking-tight">MeterOps</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary font-medium transition-colors">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">Docs</a>
            <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-hover transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
