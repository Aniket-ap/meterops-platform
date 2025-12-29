const TrustBar = () => {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Built for modern SaaS teams
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Simple Text Badges/Logos for now */}
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">JWT</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">Redis</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">MongoDB</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">Node.js</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
