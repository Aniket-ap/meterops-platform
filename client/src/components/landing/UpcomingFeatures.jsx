import { Webhook, Box, Bell, CreditCard, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Webhook,
    title: 'Webhooks',
    description: 'Receive real-time notifications for usage limits and billing events.',
    status: 'In Development',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    icon: Box,
    title: 'Official SDKs',
    description: 'Native libraries for Node.js, Python, Go, and Java.',
    status: 'Planned',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: Bell,
    title: 'Slack & Discord Alerts',
    description: 'Get notified directly in your team chat when tenants exceed quotas.',
    status: 'Planned',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    icon: CreditCard,
    title: 'Stripe Connect',
    description: 'Seamlessly sync usage data with Stripe Invoicing.',
    status: 'Research',
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
];

const UpcomingFeatures = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 mb-4 border border-blue-100">
            Roadmap
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Coming Soon to MeterOps</h2>
          <p className="mt-4 text-lg text-gray-600">We are actively building the next generation of metering tools.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider ${feature.bg} ${feature.color}`}>
                {feature.status}
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform ${feature.bg} ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">{feature.description}</p>
              
              <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                Learn more <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingFeatures;
