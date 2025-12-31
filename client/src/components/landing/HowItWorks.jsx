import { ArrowRight, Code, Settings, Activity, BarChart3, Receipt, Key } from 'lucide-react';

const steps = [
  { icon: Key, title: 'Get API Key', desc: 'Create your tenant and generate a secure API key.' },
  { icon: Settings, title: 'Define Metrics', desc: 'Configure what to track: API calls, storage, or compute time.' },
  { icon: Activity, title: 'Send Events', desc: 'Push usage data via our simple REST API.' },
  { icon: BarChart3, title: 'Monitor Usage', desc: 'View real-time analytics and tenant consumption patterns.' },
  { icon: Receipt, title: 'Export Billing', desc: 'Download usage reports for your invoicing tools.' },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/50 -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">From integration to revenue in five simple steps. Our platform handles the heavy lifting.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 relative">
           <div className="hidden lg:block absolute top-12 left-0 w-full border-t-2 border-dashed border-gray-200 -z-10"></div>

           {steps.map((step, index) => (
             <div key={index} className="relative flex flex-col items-center">
               <div className="w-24 h-24 bg-white rounded-2xl border border-gray-100 shadow-xl flex items-center justify-center mb-6 z-10 hover:scale-110 transition-transform duration-300 hover:border-primary/30">
                 <step.icon className="w-10 h-10 text-primary" />
                 <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg">
                   {index + 1}
                 </div>
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
               <p className="text-sm text-gray-500 text-center leading-relaxed max-w-[200px]">{step.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
