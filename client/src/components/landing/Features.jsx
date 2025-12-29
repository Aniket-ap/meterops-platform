import { Shield, Zap, Layout, Users, CreditCard, Activity } from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Multi-Tenant Architecture',
    description: 'Built-in data isolation and security for every tenant. Scale without worrying about data leaks.',
  },
  {
    icon: Activity,
    title: 'Feature-Level Usage Tracking',
    description: 'Monitor every API call and feature usage event in real-time with granular precision.',
  },
  {
    icon: Zap,
    title: 'Redis-Based Rate Limiting',
    description: 'Protect your API from abuse with high-performance, distributed rate limiting powered by Redis.',
  },
  {
    icon: Users,
    title: 'Role-Based Access Control',
    description: 'Granular permissions for Owners, Admins, and Members out of the box.',
  },
  {
    icon: Shield,
    title: 'Subscription Plans',
    description: 'Define Free, Pro, and Enterprise plans with different limits and feature sets.',
  },
  {
    icon: CreditCard,
    title: 'Automated Billing',
    description: 'Generate accurate invoices automatically based on actual usage and plan limits.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to monetize your API
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Stop building billing infrastructure from scratch. MeterOps gives you the building blocks to scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
