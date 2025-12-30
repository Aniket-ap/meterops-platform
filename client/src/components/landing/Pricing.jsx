import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    description: 'Perfect for side projects and learning.',
    features: ['100 API requests/mo', '1 Team Member', 'Community Support', 'Basic Analytics'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/mo',
    description: 'For scaling startups and businesses.',
    features: ['5,000 API requests/mo', 'Unlimited Team Members', 'Priority Email Support', 'Advanced Analytics', 'Automated Invoicing', 'Rate Limiting'],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '₹4,999',
    description: 'For high-volume production systems.',
    features: ['Unlimited requests', 'SLA Guarantee', 'Dedicated Success Manager', 'Custom Integrations', 'Audit Logs', 'SSO & SAML'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-32 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider mb-2">Pricing Plans</h2>
          <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Simple pricing for every stage
          </p>
          <p className="text-xl text-gray-600 mb-8">
            Start free, upgrade as you grow. No credit card required to start.
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
             <span className={`text-sm font-semibold ${!annual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
             <button 
               onClick={() => setAnnual(!annual)}
               className="relative w-14 h-8 bg-gray-200 rounded-full transition-colors duration-300 focus:outline-none"
             >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${annual ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
             <span className={`text-sm font-semibold ${annual ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-full ml-1">-20%</span>
             </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted 
                  ? 'bg-white shadow-2xl scale-110 ring-4 ring-primary/10 z-10' 
                  : 'bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 min-h-[40px]">{plan.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    {annual ? (
                      plan.name === 'Pro' ? '₹399' :
                      plan.name === 'Enterprise' ? '₹3,999' :
                      plan.price
                    ) : (
                      plan.price
                    )}
                  </span>
                  {plan.period && <span className="ml-2 text-gray-500 font-medium">{plan.period}</span>}
                </div>
              </div>

              <div className="flex-1 mb-8">
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">What's included</div>
                 <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlighted ? 'bg-primary/10' : 'bg-gray-100'} mr-3 shrink-0`}>
                         <Check className={`h-3.5 w-3.5 ${plan.highlighted ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                className={`w-full block text-center py-4 rounded-xl text-base font-bold transition-all ${
                  plan.highlighted
                    ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                    : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
           <p className="text-gray-500">Need a custom enterprise plan? <a href="#" className="text-primary font-bold hover:underline">Contact us</a></p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
