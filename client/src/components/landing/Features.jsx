import { Shield, Zap, Layout, Users, CreditCard, Activity, Lock, Globe, Server, Database, Code } from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Tenant Isolation',
    description: 'Built-in multi-tenancy ensures data security. Every customer gets their own usage sandbox.',
    color: 'bg-blue-500',
  },
  {
    icon: Activity,
    title: 'Real-time Metering',
    description: 'Ingest and aggregate usage events with millisecond latency using our high-performance pipeline.',
    color: 'bg-purple-500',
  },
  {
    icon: Zap,
    title: 'Distributed Rate Limiting',
    description: 'Protect your API resources with sliding window rate limits powered by Redis cluster.',
    color: 'bg-yellow-500',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Granular permissions for Owners, Admins, and Members. Manage team access effortlessly.',
    color: 'bg-green-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, JWT authentication, and automated audit trails for compliance.',
    color: 'bg-red-500',
  },
  {
    icon: CreditCard,
    title: 'Usage-Based Billing',
    description: 'Automatically calculate bills based on tracked usage and generate invoices instantly.',
    color: 'bg-indigo-500',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider mb-2">Platform Capabilities</h2>
          <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Infrastructure for Usage-Based SaaS
          </p>
          <p className="mt-6 text-xl text-gray-600">
             Stop building billing from scratch. MeterOps provides the complete toolkit to monetize your API products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 bg-gray-50 rounded-3xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
               {/* Hover Gradient Background */}
               <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               
               <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${feature.color} text-white`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tech Stack Section */}
        <div className="mt-32">
           <div className="bg-[#0f172a] rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                 <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                 <h2 className="text-3xl sm:text-4xl font-bold mb-6">Engineered for Scale</h2>
                 <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                    MeterOps is architected with a modern, high-performance stack designed to handle millions of requests without breaking a sweat.
                 </p>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center gap-3 group">
                       <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:border-green-500/50 transition-colors">
                          <Server className="w-10 h-10 text-green-400" />
                       </div>
                       <span className="font-bold text-gray-200">Node.js</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group">
                       <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:border-blue-500/50 transition-colors">
                          <Code className="w-10 h-10 text-blue-400" />
                       </div>
                       <span className="font-bold text-gray-200">React</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group">
                       <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:border-red-500/50 transition-colors">
                          <Zap className="w-10 h-10 text-red-400" />
                       </div>
                       <span className="font-bold text-gray-200">Redis</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group">
                       <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:border-green-500/50 transition-colors">
                          <Database className="w-10 h-10 text-green-500" />
                       </div>
                       <span className="font-bold text-gray-200">MongoDB</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
