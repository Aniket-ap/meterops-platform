import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import UpgradeCTA from '../../components/UpgradeCTA';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Zap, Activity, Calendar } from 'lucide-react';

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

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  const UsageProgress = ({ current, limit, plan }) => {
    // JSON serializes Infinity as null, so null limit implies Unlimited (Enterprise)
    const isUnlimited = limit === null; 
    const percentage = isUnlimited ? 0 : Math.min(100, (current / limit) * 100);
    const isDanger = !isUnlimited && percentage >= 90;
    const isWarning = !isUnlimited && percentage >= 80;
    
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">Monthly Limit</h3>
            <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs border border-indigo-100 uppercase tracking-wide">{plan} Plan</span>
            </p>
          </div>
          <div className="text-right">
            {isUnlimited ? (
               <span className="text-xl font-bold text-emerald-600 flex items-center gap-1">
                 <Zap className="w-5 h-5 fill-current" /> Unlimited
               </span>
            ) : (
              <>
                <span className={`text-3xl font-bold ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>
                  {current.toLocaleString()}
                </span>
                <span className="text-gray-400 ml-1 font-medium text-lg">/ {limit.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>
        
        {!isUnlimited && (
          <>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-6">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-indigo-600'}`}
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
      <div className="min-h-screen bg-gray-50/50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <Activity className="w-6 h-6" />
            <div>
              <div className="font-bold">Error Loading Data</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = items.map(item => ({
    name: item.feature.replace(/_/g, ' '), // beautify name
    value: item.total,
    originalKey: item.feature
  }));

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
            <p className="text-gray-500 mt-1">Monitor your API consumption and feature limits.</p>
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {meta && (
          <UsageProgress 
            current={meta.currentMonthUsage} 
            limit={meta.limit} 
            plan={meta.plan} 
          />
        )}

        {!items.length ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No usage data found</h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              {period === 'today' 
                ? "No API activity has been recorded today." 
                : "It looks like you haven't used any features yet. Start making API calls to see data here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Usage by Feature</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 12}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 12}}
                    />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List Section */}
            <div className="space-y-4">
              {items.map((it, index) => (
                <div key={it.feature} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-transform hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      #{index + 1}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mt-2">{it.feature.replace(/_/g, ' ')}</h4>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-indigo-600">{it.total.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">calls</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Usage;
