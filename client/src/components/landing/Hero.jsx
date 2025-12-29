import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, CreditCard } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] tracking-tight">
              Track usage. <br />
              Control access. <br />
              <span className="text-primary">Monetize your SaaS.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              MeterOps helps SaaS teams track feature usage, enforce rate limits, and automate billing — all in one platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/25"
              >
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:border-gray-300"
              >
                View Docs
              </a>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="relative rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 z-10 transform transition-transform hover:scale-[1.01] duration-500">
              {/* Fake Dashboard Header */}
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <BarChart3 size={18} />
                    <span className="text-sm font-medium">API Calls</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">1.2M</div>
                  <div className="text-xs text-indigo-600 mt-1">+12% vs last month</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <Users size={18} />
                    <span className="text-sm font-medium">Active Tenants</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">843</div>
                  <div className="text-xs text-green-600 mt-1">98% retention</div>
                </div>
              </div>

              {/* Usage Chart Mockup */}
              <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/30 transition-colors cursor-pointer relative group"
                    style={{ height: `${h}%` }}
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h * 100}
                     </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
