import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, CreditCard } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200 mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-pink-200 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary bg-primary/10 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              v1.0 is now live
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Monetize your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-pink-600">
                API Potential
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10">
              The complete infrastructure for SaaS metering. Track usage, enforce limits, and bill customers without writing a single line of billing code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-100 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Explore Features
              </a>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="avatar" />
                   </div>
                 ))}
               </div>
               <div>Trusted by 500+ developers</div>
            </div>
          </div>

          {/* Right Content - Modern Glass Card */}
          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none perspective-1000">
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 p-8 z-10 transform transition-transform hover:rotate-1 duration-500">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-lg font-bold text-gray-900">Monthly Revenue</h3>
                   <p className="text-sm text-gray-500">Real-time overview</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg text-green-700 font-bold text-sm">+12.5%</div>
              </div>

              {/* Big Stat */}
              <div className="mb-8">
                 <div className="text-5xl font-extrabold text-gray-900 tracking-tight">$24,500.00</div>
                 <div className="h-2 w-full bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[75%]"></div>
                 </div>
              </div>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                   <div className="flex items-center gap-2 mb-2 text-gray-500">
                      <Users size={16} />
                      <span className="text-xs font-bold uppercase">Active Tenants</span>
                   </div>
                   <div className="text-2xl font-bold text-gray-900">1,240</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                   <div className="flex items-center gap-2 mb-2 text-gray-500">
                      <BarChart3 size={16} />
                      <span className="text-xs font-bold uppercase">API Requests</span>
                   </div>
                   <div className="text-2xl font-bold text-gray-900">8.5M</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-8 top-1/2 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce-slow hidden sm:block">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                     <CreditCard size={20} />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-gray-900">Payment Recieved</div>
                     <div className="text-xs text-gray-500">Just now</div>
                  </div>
                  <div className="text-sm font-bold text-green-600 ml-2">+$49.00</div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
