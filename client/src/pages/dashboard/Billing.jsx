import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Billing = () => {
  const { user, tenant } = useAuth();
  const [plan, setPlan] = useState(tenant?.plan || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/users/me');
        if (data?.success) {
          setPlan(data.data?.tenant?.plan || '');
        } else {
          const t = data?.tenant || null;
          setPlan(t?.plan || '');
        }
      } catch (err) {
        setError('Failed to load billing information');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleGenerateInvoice = async () => {
    setError('');
    setInvoice(null);
    setGenerating(true);
    try {
      const { data } = await api.post('/billing/generate');
      const payload = data?.data || data;
      setInvoice({
        amount: payload?.amount ?? payload?.invoice?.amount ?? null,
        status: payload?.status ?? payload?.invoice?.status ?? 'UNKNOWN',
        id: payload?.id ?? payload?.invoice?.id ?? null,
        message: data?.message || null,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate invoice';
      setError(msg);
    } finally {
      setGenerating(false);
    }
  };

  if (user?.role === 'MEMBER') {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
            <div className="mt-4 text-red-600 font-semibold">Access restricted</div>
            <div className="text-gray-600 text-sm mt-2">Only OWNER and ADMIN can view billing.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Current Plan</h2>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : plan ? (
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">{plan}</span>
              <button
                onClick={handleGenerateInvoice}
                disabled={generating}
                className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-hover transition-all transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate Invoice'}
              </button>
            </div>
          ) : (
            <div className="text-gray-500">No plan information available.</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Latest Invoice</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {!invoice ? (
            <div className="text-gray-500">No invoice generated yet.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">{invoice.amount != null ? `$${invoice.amount}` : '—'}</span>
              </div>
              {invoice.id && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Invoice ID:</span>
                  <span className="font-mono text-sm">{invoice.id}</span>
                </div>
              )}
              {invoice.message && (
                <div className="text-gray-500">{invoice.message}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
