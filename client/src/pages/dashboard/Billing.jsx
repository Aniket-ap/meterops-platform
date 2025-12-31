import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import UpgradeCTA from '../../components/UpgradeCTA';
import { 
  CreditCard, 
  FileText, 
  Download, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
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

const Billing = () => {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [generateSuccess, setGenerateSuccess] = useState('');

  const fetchBillingSummary = async () => {
    try {
      const { data } = await api.get('/billing/summary');
      if (data.success) {
        setSummary(data.data || {});
      }
    } catch (err) {
      console.error("Failed to fetch billing summary", err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data } = await api.get('/billing/invoices');
      if (data.success) {
        setInvoices(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch invoices", err);
      setInvoices([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBillingSummary(), fetchInvoices()]);
      setLoading(false);
    };
    if (user) {
      loadData();
    }
  }, [user]);

  const handleGenerateInvoice = async () => {
    setGenerateError('');
    setGenerateSuccess('');
    setGenerating(true);
    try {
      const { data } = await api.post('/billing/generate');
      if (data.success) {
        setGenerateSuccess('Invoice generated successfully');
        // Refresh summary to show new invoice
        fetchBillingSummary();
        fetchInvoices();
      }
    } catch (err) {
      setGenerateError(err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setGenerating(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.role !== 'OWNER') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Only workspace Owners can view billing information and manage subscriptions.
        </p>
      </div>
    );
  }

  const { plan, usageThisMonth, limit, estimatedCost, latestInvoice, totalAmountDue } = summary || {};
  const totalUsageCount = usageThisMonth?.total || 0;
  const isUnlimited = limit === null || limit === undefined; 
  
  const rawPercentage = (totalUsageCount / limit) * 100;
  const usagePercentage = isUnlimited ? 0 : (isNaN(rawPercentage) ? 0 : Math.min(100, rawPercentage));

  // Prepare chart data from invoices (last 6 months)
  const chartData = invoices
    .slice(0, 6)
    .reverse()
    .map(inv => ({
      name: inv.billingMonth, // e.g., "2023-10"
      amount: inv.totalAmount
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
        <p className="text-gray-500 mt-1">Manage your plan, usage, and billing history.</p>
      </div>

      {/* Upgrade CTA */}
      {!isUnlimited && <UpgradeCTA percentage={usagePercentage} plan={plan} />}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Plan</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{plan}</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2">
             <div className="flex items-center gap-2 text-sm text-gray-600">
               <CheckCircle size={14} className="text-green-500" />
               {plan === 'FREE' ? 'Free forever' : plan === 'PRO' ? '₹499 / month + usage' : 'Custom pricing'}
             </div>
          </div>
        </div>

        {/* Current Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Month Usage</p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-2xl font-bold text-gray-900">{totalUsageCount?.toLocaleString()}</h3>
                {!isUnlimited && <span className="text-gray-500 mb-1 text-sm">/ {limit?.toLocaleString()}</span>}
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          {!isUnlimited ? (
            <div className="mt-3">
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${usagePercentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 flex justify-between">
                <span>{usagePercentage.toFixed(0)}% Used</span>
                {usagePercentage > 80 && <span className="text-red-500 font-medium">Near Limit</span>}
              </p>
            </div>
          ) : (
            <div className="mt-4 text-sm text-green-600 font-medium flex items-center gap-1">
              <CheckCircle size={14} /> Unlimited Access
            </div>
          )}
        </div>

        {/* Amount Due */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount Due</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalAmountDue?.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          {user?.role === 'OWNER' && (
             <button
               onClick={handleGenerateInvoice}
               disabled={generating || !!latestInvoice}
               className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {generating ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                   Generating...
                 </>
               ) : latestInvoice ? (
                 <>
                   <CheckCircle size={16} className="mr-2" />
                   Invoice Generated
                 </>
               ) : (
                 <>
                   <FileText size={16} className="mr-2" />
                   Generate Invoice
                 </>
               )}
             </button>
          )}
          {generateError && (
            <div className="flex items-center gap-1 text-xs text-red-600 mt-2">
              <AlertCircle size={12} /> {generateError}
            </div>
          )}
          {generateSuccess && (
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
              <CheckCircle size={12} /> {generateSuccess}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing History Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
            <div className="p-2 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={50} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
              <TrendingUp size={48} className="mb-2 opacity-20" />
              <p>No billing history available yet</p>
            </div>
          )}
        </div>

        {/* Latest Invoice Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Invoice</h3>
          {latestInvoice ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
                    #{latestInvoice._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    latestInvoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {latestInvoice.status}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Billing Period</p>
                  <p className="font-semibold text-gray-900">{latestInvoice.billingMonth}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-xl font-bold text-gray-900">₹{latestInvoice.totalAmount.toFixed(2)}</p>
                  </div>
                  <button className="text-primary hover:text-primary-hover p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Clock size={14} /> Generated
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(latestInvoice.generatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <CreditCard size={14} /> Payment Method
                  </span>
                  <span className="font-medium text-gray-900">
                    Visa •••• 4242
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
              <FileText size={48} className="mb-2 opacity-20" />
              <p>No invoices generated yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Invoice History</h3>
          <button className="text-sm text-primary font-medium hover:text-primary-hover">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing Month</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">#{inv._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {inv.billingMonth}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{inv.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(inv.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-primary transition-colors">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                        <FileText size={24} className="text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-900">No invoices found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
