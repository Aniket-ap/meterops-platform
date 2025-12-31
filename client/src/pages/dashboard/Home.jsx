import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Users, 
  Activity, 
  CreditCard, 
  Shield, 
  ArrowRight, 
  TrendingUp,
  Zap 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { user, tenant } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [usageTotal, setUsageTotal] = useState(0);
  const [usageHistory, setUsageHistory] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: meData }, usersRes, usageRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/users').catch((e) => e),
          api.get('/usage/summary?period=30d').catch((e) => e),
        ]);

        if (meData?.success) {
          setMe(meData.data);
        } else {
          setMe({ user, tenant });
        }

        if (usersRes?.data) {
          const u = Array.isArray(usersRes.data)
            ? usersRes.data
            : usersRes.data.success
            ? usersRes.data.data
            : [];
          setTotalUsers(Array.isArray(u) ? u.length : 0);
        }

        if (usageRes?.data) {
          const raw = usageRes.data.success ? usageRes.data.data : usageRes.data;
          // Calculate total usage
          const sum = Array.isArray(raw) ? raw.reduce((acc, i) => acc + (i.total || 0), 0) : 0;
          setUsageTotal(sum);
          
          // Generate mock history data for the chart based on the total
          // In a real app, we'd fetch daily breakdown
          const history = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
              name: date.toLocaleDateString('en-US', { weekday: 'short' }),
              value: Math.floor(sum / 7 + (Math.random() * sum * 0.1) - (sum * 0.05)),
            };
          });
          setUsageHistory(history);
        }
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const resolvedUser = me?.user || user;
  const resolvedTenant = me?.tenant || tenant;

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {resolvedUser?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with <span className="font-semibold text-gray-700">{resolvedTenant?.name || 'your workspace'}</span> today.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
               {resolvedTenant?.domain || 'No Domain'}
             </span>
             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
               resolvedTenant?.plan === 'PRO' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
               resolvedTenant?.plan === 'ENTERPRISE' ? 'bg-purple-50 text-purple-700 border-purple-200' :
               'bg-green-50 text-green-700 border-green-200'
             }`}>
               {resolvedTenant?.plan || 'FREE'} Plan
             </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={totalUsers} 
            icon={Users} 
            color="bg-blue-500"
            subtitle="Active team members"
          />
          <StatCard 
            title="Total Usage" 
            value={usageTotal.toLocaleString()} 
            icon={Activity} 
            color="bg-indigo-500"
            subtitle="API calls this month"
          />
          <StatCard 
            title="Current Plan" 
            value={resolvedTenant?.plan || 'Free'} 
            icon={Shield} 
            color="bg-purple-500"
            subtitle="Renewal in 12 days"
          />
          <StatCard 
            title="Est. Cost" 
            value="₹0.00" 
            icon={CreditCard} 
            color="bg-emerald-500"
            subtitle="Current billing cycle"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Usage Trends</h3>
                <p className="text-sm text-gray-500">Activity over the last 7 days</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageHistory}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}} 
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Next Steps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <a href="/dashboard/users" className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700">Invite Team</h4>
                    <p className="text-xs text-gray-500 group-hover:text-blue-600">Add members to workspace</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </a>

              <a href="/dashboard/usage" className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer border border-transparent hover:border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700">Check Usage</h4>
                    <p className="text-xs text-gray-500 group-hover:text-indigo-600">View detailed analytics</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500" />
              </a>

              <a href="/dashboard/billing" className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors cursor-pointer border border-transparent hover:border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700">Manage Plan</h4>
                    <p className="text-xs text-gray-500 group-hover:text-emerald-600">Upgrade or view invoices</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
