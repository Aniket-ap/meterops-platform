const TrustBar = () => {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Powering usage-based billing for
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Simple Text Badges/Logos for now */}
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">DevTools Inc</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">API First</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">CloudScale</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-700">DataFlow</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
