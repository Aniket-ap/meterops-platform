import { Terminal } from 'lucide-react';

const DeveloperSection = () => {
  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-6">
              <Terminal className="w-4 h-4 mr-2" />
              Developer First
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Designed for modern engineering. <br />
              <span className="text-indigo-400">Simple APIs. Powerful billing.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Integrate metering into your application with our high-performance SDKs. 
              We handle the complex logic of aggregation, windowing, and overage protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                <span>RESTful API</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">2</div>
                <span>Secure Auth</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">3</div>
                <span>JSON Events</span>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20"></div>
             <div className="relative bg-gray-950 rounded-xl border border-gray-800 p-6 font-mono text-sm shadow-2xl">
               <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <span className="ml-2 text-xs text-gray-500">bash</span>
               </div>
               <div className="space-y-2">
                 <div className="flex">
                   <span className="text-green-400 mr-2">$</span>
                   <span className="text-gray-300">curl -X GET https://api.meterops.com/v1/usage/summary \</span>
                 </div>
                 <div className="pl-4">
                   <span className="text-gray-300">-H "Authorization: Bearer <span className="text-yellow-400">YOUR_API_KEY</span>"</span>
                 </div>
                 <div className="mt-4 text-gray-500"># Response</div>
                 <div className="text-blue-300">{`{`}</div>
                 <div className="pl-4 text-blue-300">"tenantId": <span className="text-orange-300">"tnt_12345"</span>,</div>
                 <div className="pl-4 text-blue-300">"period": <span className="text-orange-300">"2023-10"</span>,</div>
                 <div className="pl-4 text-blue-300">"usage": [</div>
                 <div className="pl-8 text-blue-300">{`{`}</div>
                 <div className="pl-12 text-blue-300">"feature": <span className="text-orange-300">"api_calls"</span>,</div>
                 <div className="pl-12 text-blue-300">"count": <span className="text-purple-300">14502</span></div>
                 <div className="pl-8 text-blue-300">{`}`}</div>
                 <div className="pl-4 text-blue-300">]</div>
                 <div className="text-blue-300">{`}`}</div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DeveloperSection;
