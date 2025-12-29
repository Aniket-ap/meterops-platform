import { ArrowRight, UserPlus, Users, Activity, ShieldCheck, FileText } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Register Company', desc: 'Create your tenant account.' },
  { icon: Users, title: 'Invite Team', desc: 'Add members with roles.' },
  { icon: Activity, title: 'Track Usage', desc: 'Monitor API calls.' },
  { icon: ShieldCheck, title: 'Enforce Limits', desc: 'Auto-block overages.' },
  { icon: FileText, title: 'Generate Invoices', desc: 'Automate billing.' },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">From signup to invoice in five simple steps.</p>
        </div>

        <div className="relative">
           {/* Connecting Line (Desktop) */}
           <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
             {steps.map((step, index) => (
               <div key={index} className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center shadow-sm mb-6 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300 relative z-10">
                   <step.icon className="w-8 h-8 text-primary" />
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                     {index + 1}
                   </div>
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                 <p className="text-sm text-gray-500">{step.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
