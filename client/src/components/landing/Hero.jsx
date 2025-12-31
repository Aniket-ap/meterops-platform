import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Server, Database, Code2, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-sky-100 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary bg-primary/10 mb-6 border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              MeterOps v1.0 Live
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Intelligent Usage <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-blue-600">
                Metering & Billing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10">
              The usage-based billing infrastructure for modern SaaS. Track millions of events, enforce real-time limits, and automate invoicing with a few lines of code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary rounded-2xl hover:bg-primary-hover transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Start Metering Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium">
               <div className="flex items-center gap-2">
                 <div className="p-1 bg-green-100 rounded-full text-green-600">
                    <Activity size={14} />
                 </div>
                 <span>99.99% Uptime</span>
               </div>
               <div className="h-4 w-px bg-gray-300"></div>
               <div className="flex items-center gap-2">
                 <div className="p-1 bg-blue-100 rounded-full text-blue-600">
                    <Zap size={14} />
                 </div>
                 <span>&lt; 10ms Latency</span>
               </div>
            </div>
          </div>

          {/* Right Content - Technical/Dashboard Visual */}
          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none perspective-1000">
            {/* Code Window */}
            <div className="relative rounded-xl bg-[#1e1e1e] shadow-2xl border border-gray-800 p-4 transform transition-transform hover:rotate-1 duration-500 z-10">
              {/* Window Controls */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-xs text-gray-500 font-mono">api-request.sh</div>
              </div>
              
              {/* Code Snippet */}
              <div className="font-mono text-sm leading-relaxed overflow-hidden">
                <div className="text-gray-400"># Send usage event via API</div>
                <div className="flex">
                  <span className="text-purple-400">curl</span>
                  <span className="text-gray-300 ml-2">-X POST</span>
                  <span className="text-green-400 ml-2">/v1/events</span>
                  <span className="text-gray-300"> \</span>
                </div>
                <div className="pl-4 flex">
                  <span className="text-gray-300">-H</span>
                  <span className="text-orange-300 ml-2">"Authorization: Bearer key_..."</span>
                  <span className="text-gray-300"> \</span>
                </div>
                <div className="pl-4 flex">
                  <span className="text-gray-300">-d</span>
                  <span className="text-blue-300 ml-2">'{`{`}</span>
                </div>
                <div className="pl-8 flex">
                  <span className="text-blue-300">"event":</span>
                  <span className="text-orange-300 ml-2">"api_call"</span>
                  <span className="text-gray-300">,</span>
                </div>
                <div className="pl-8 flex">
                  <span className="text-blue-300">"tenant":</span>
                  <span className="text-orange-300 ml-2">"org_123"</span>
                  <span className="text-gray-300">,</span>
                </div>
                <div className="pl-8 flex">
                  <span className="text-blue-300">"value":</span>
                  <span className="text-purple-300 ml-2">1</span>
                </div>
                <div className="pl-4 flex">
                  <span className="text-blue-300">{'}'}</span>
                </div>
              </div>
            </div>

            {/* Floating Live Metric Card */}
            <div className="absolute -right-4 -bottom-12 sm:-right-12 sm:bottom-8 bg-white rounded-xl shadow-xl border border-gray-100 p-5 w-64 animate-bounce-slow z-20">
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                     <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                     </div>
                     <span className="text-xs font-bold text-gray-500 uppercase">Live Ingestion</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">120ms ago</span>
               </div>
               <div className="flex items-end justify-between">
                  <div>
                     <div className="text-2xl font-bold text-gray-900">4,285</div>
                     <div className="text-xs text-gray-500">events / sec</div>
                  </div>
                  <div className="h-8 w-20 flex items-end gap-1">
                     <div className="w-full bg-primary/20 rounded-sm h-[40%]"></div>
                     <div className="w-full bg-primary/40 rounded-sm h-[70%]"></div>
                     <div className="w-full bg-primary/60 rounded-sm h-[50%]"></div>
                     <div className="w-full bg-primary rounded-sm h-[90%]"></div>
                     <div className="w-full bg-primary/80 rounded-sm h-[60%]"></div>
                  </div>
               </div>
            </div>

            {/* Background Decor Elements */}
            <div className="absolute -top-12 -right-12 text-gray-100 -z-10 transform rotate-12">
               <Server size={140} strokeWidth={0.5} />
            </div>
            <div className="absolute -bottom-8 -left-8 text-gray-100 -z-10 transform -rotate-12">
               <Database size={140} strokeWidth={0.5} />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
