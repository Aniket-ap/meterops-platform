import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
          Ready to monetize your API?
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Join the next generation of SaaS companies using MeterOps for usage-based billing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/25 transform hover:-translate-y-1"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
