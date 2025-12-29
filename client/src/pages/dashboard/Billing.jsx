import { useState } from 'react';
import api from '../../services/api';

const Billing = () => {
  const [loading, setLoading] = useState(false);

  const generateInvoice = async () => {
    setLoading(true);
    try {
      await api.post('/billing/generate');
      alert('Invoice generated successfully (check backend logs)');
    } catch (error) {
      alert('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <button
          onClick={generateInvoice}
          disabled={loading}
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Invoice'}
        </button>
      </div>
      <p className="mt-4 text-gray-600">Manage your subscription and invoices.</p>
    </div>
  );
};
export default Billing;
