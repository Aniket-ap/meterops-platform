import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'FREE',
    price: '$0',
    description: 'Perfect for testing and small projects.',
    features: ['Up to 1,000 requests/mo', '1 Team Member', 'Basic Usage Analytics', 'Community Support'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'PRO',
    price: '$29',
    period: '/mo',
    description: 'For growing SaaS businesses.',
    features: ['Up to 100,000 requests/mo', 'Unlimited Team Members', 'Advanced Analytics', 'Priority Email Support', 'Automated Invoicing'],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom',
    description: 'For large scale applications.',
    features: ['Unlimited requests', 'SLA Guarantee', 'Dedicated Account Manager', 'Custom Integrations', 'Audit Logs'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that fits your growth stage. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl p-8 shadow-sm flex flex-col ${
                plan.highlighted 
                  ? 'bg-gray-900 text-white shadow-xl scale-105 ring-1 ring-gray-900' 
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`text-lg font-semibold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  {plan.period && <span className={`ml-1 text-sm ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</span>}
                </div>
                <p className={`mt-4 text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className={`h-5 w-5 mr-3 shrink-0 ${plan.highlighted ? 'text-primary' : 'text-primary'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full block text-center py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
