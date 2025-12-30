import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Usage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const { data } = await api.get('/usage/summary');
        let list = [];
        if (Array.isArray(data)) {
          list = data.map((x) => ({
            feature: x._id || x.feature,
            total: x.total ?? 0,
          }));
        } else if (data.success && Array.isArray(data.data)) {
          list = data.data.map((x) => ({
            feature: x.feature,
            total: x.total,
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
  }, []);

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">Loading usage...</div>;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 font-semibold">Error</div>
        <div className="text-gray-600 text-sm mt-2">{error}</div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-800 font-semibold">No usage data</div>
        <div className="text-gray-600 text-sm mt-2">Feature usage will appear once activity occurs.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Usage Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.feature} className="border rounded-lg p-4">
            <div className="text-gray-600 text-sm">Feature</div>
            <div className="font-semibold text-gray-900">{it.feature}</div>
            <div className="mt-2 text-gray-600 text-sm">Total</div>
            <div className="font-semibold text-indigo-600">{it.total}</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-gray-600">Feature</th>
                <th className="px-4 py-2 text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.feature} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{it.feature}</td>
                  <td className="px-4 py-2">{it.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usage;
