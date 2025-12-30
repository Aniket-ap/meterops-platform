import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import UpgradeCTA from '../../components/UpgradeCTA';

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
      // Don't clear summary on error to avoid flashing, but maybe show error toast
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
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user?.role !== 'OWNER') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
            <p className="text-gray-500">Only workspace Owners can view billing information.</p>
          </div>
        </div>
      </div>
    );
  }

  const { plan, usageThisMonth, limit, estimatedCost, latestInvoice, totalAmountDue } = summary || {};
  const totalUsageCount = usageThisMonth?.total || 0;
  const isUnlimited = limit === null || limit === undefined; 
  
  const rawPercentage = (totalUsageCount / limit) * 100;
  const usagePercentage = isUnlimited ? 0 : (isNaN(rawPercentage) ? 0 : Math.min(100, rawPercentage));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500 mt-1">Manage your plan, usage, and billing history.</p>
        </div>

        {/* Upgrade CTA */}
        {!isUnlimited && <UpgradeCTA percentage={usagePercentage} plan={plan} />}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Current Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Plan</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{plan}</h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Active
              </span>
            </div>
            <div className="mt-4">
               <p className="text-sm text-gray-600">
                 {plan === 'FREE' ? 'Free forever' : plan === 'PRO' ? '₹499 / month + usage' : 'Custom pricing'}
               </p>
            </div>
          </div>

          {/* Current Usage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Current Month Usage</p>
            <div className="flex items-end gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{totalUsageCount?.toLocaleString()}</h3>
              {!isUnlimited && <span className="text-gray-500 mb-1">/ {limit?.toLocaleString()}</span>}
            </div>
            
            {!isUnlimited ? (
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${usagePercentage > 90 ? 'bg-red-500' : 'bg-indigo-600'}`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            ) : (
              <div className="text-sm text-green-600 font-medium mb-2">Unlimited Access</div>
            )}
            
            <p className="text-xs text-gray-500">
              Est. Cost: <span className="font-medium text-gray-900">₹{estimatedCost?.toFixed(2)}</span>
            </p>
          </div>

          {/* Amount Due */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Amount Due</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">₹{totalAmountDue?.toFixed(2)}</h3>
            {user?.role === 'OWNER' && (
               <button
                 onClick={handleGenerateInvoice}
                 disabled={generating || !!latestInvoice}
                 className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {generating ? (
                   <>
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Generating...
                   </>
                 ) : latestInvoice ? 'Invoice Generated' : 'Generate Invoice'}
               </button>
            )}
            {generateError && <p className="text-xs text-red-600 mt-2">{generateError}</p>}
            {generateSuccess && <p className="text-xs text-green-600 mt-2">{generateSuccess}</p>}
          </div>
        </div>

        {/* Latest Invoice Section */}
        {latestInvoice && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Latest Invoice</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-900">
                      Invoice #{latestInvoice._id.slice(-6).toUpperCase()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      latestInvoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {latestInvoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    For {latestInvoice.billingMonth} • Generated on {new Date(latestInvoice.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{latestInvoice.totalAmount.toFixed(2)}</p>
                  <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium mt-1">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Invoice History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{inv._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inv.billingMonth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{inv.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inv.generatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Billing;
