import { Shield, Zap, Layout, Users, CreditCard, Activity, Lock, Globe, Server } from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Multi-Tenant Architecture',
    description: 'Built-in data isolation and security for every tenant. Scale without worrying about data leaks.',
    color: 'bg-blue-500',
  },
  {
    icon: Activity,
    title: 'Precision Metering',
    description: 'Monitor every API call and feature usage event in real-time with granular precision.',
    color: 'bg-purple-500',
  },
  {
    icon: Zap,
    title: 'Smart Rate Limiting',
    description: 'Protect your API from abuse with high-performance, distributed rate limiting powered by Redis.',
    color: 'bg-yellow-500',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Granular permissions for Owners, Admins, and Members out of the box.',
    color: 'bg-green-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, JWT authentication, and automated audit logs.',
    color: 'bg-red-500',
  },
  {
    icon: CreditCard,
    title: 'Automated Billing',
    description: 'Generate accurate invoices automatically based on actual usage and plan limits.',
    color: 'bg-indigo-500',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider mb-2">Powerful Features</h2>
          <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Everything you need to monetize
          </p>
          <p className="mt-6 text-xl text-gray-600">
             Stop building billing infrastructure from scratch. MeterOps gives you the building blocks to scale.
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
        
        {/* Alternative Section - "Tech Stack" / "Why Us" */}
        <div className="mt-32">
           <div className="bg-gray-900 rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-full h-full">
                 <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-primary/30 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-purple-600/30 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                 <h2 className="text-3xl sm:text-4xl font-bold mb-6">Built for Developers, by Developers</h2>
                 <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
                    MeterOps is architected with the modern stack you love. Open source friendly, extensible, and built for speed.
                 </p>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <Server className="w-8 h-8 text-green-400" />
                       </div>
                       <span className="font-bold">Node.js</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <Globe className="w-8 h-8 text-blue-400" />
                       </div>
                       <span className="font-bold">React</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <Lock className="w-8 h-8 text-yellow-400" />
                       </div>
                       <span className="font-bold">Redis</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <Activity className="w-8 h-8 text-green-500" />
                       </div>
                       <span className="font-bold">MongoDB</span>
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
