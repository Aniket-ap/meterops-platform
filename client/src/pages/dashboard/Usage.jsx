import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import UpgradeCTA from '../../components/UpgradeCTA';

const Usage = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    const fetchUsage = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/usage/summary?period=${period}`);
        let list = [];
        if (data.success) {
          list = data.data || [];
          setMeta(data.meta);
        } else if (Array.isArray(data)) {
          // Fallback for old API response style
          list = data.map((x) => ({
            feature: x._id || x.feature,
            total: x.total ?? 0,
          }));
        } else {
          setError('Unexpected response format');
        }
        setItems(list);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load usage summary';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, [period]);

  const UsageProgress = ({ current, limit, plan }) => {
    // JSON serializes Infinity as null, so null limit implies Unlimited (Enterprise)
    const isUnlimited = limit === null; 
    const percentage = isUnlimited ? 0 : Math.min(100, (current / limit) * 100);
    const isDanger = !isUnlimited && percentage >= 90;
    const isWarning = !isUnlimited && percentage >= 80;
    
    return (
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-gray-800 font-semibold">Monthly Usage</h3>
            <p className="text-sm text-gray-500 font-medium">{plan} Plan</p>
          </div>
          <div className="text-right">
            {isUnlimited ? (
               <span className="text-xl font-bold text-green-600">Unlimited</span>
            ) : (
              <>
                <span className={`text-2xl font-bold ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>
                  {current.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">/ {limit.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>
        
        {!isUnlimited && (
          <>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-4">
              <div 
                className={`h-full transition-all duration-500 ${isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-indigo-600'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <UpgradeCTA percentage={percentage} plan={plan} />
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Usage Summary</h2>
          <div className="w-32 h-10 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="h-24 bg-gray-50 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-50 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Usage Summary</h2>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
          <div className="font-semibold">Error</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Usage Summary</h2>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {meta && (
        <UsageProgress 
          current={meta.currentMonthUsage} 
          limit={meta.limit} 
          plan={meta.plan} 
        />
      )}

      {!items.length ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-800 font-semibold">No usage data</div>
          <div className="text-gray-600 text-sm mt-2">
            {period === 'today' 
              ? "No activity recorded today." 
              : "Feature usage will appear once activity occurs."}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {items.map((it) => (
              <div key={it.feature} className="border rounded-lg p-4 bg-gray-50">
                <div className="text-gray-600 text-xs uppercase tracking-wider font-semibold mb-1">Feature</div>
                <div className="font-medium text-gray-900 mb-3">{it.feature.replace(/_/g, ' ')}</div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-gray-500 text-xs">Total Calls</div>
                    <div className="text-2xl font-bold text-primary">{it.total}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-gray-600 font-medium">Feature Name</th>
                  <th className="px-4 py-3 text-gray-600 font-medium text-right">Total Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((it) => (
                  <tr key={it.feature} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{it.feature}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{it.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Usage;
