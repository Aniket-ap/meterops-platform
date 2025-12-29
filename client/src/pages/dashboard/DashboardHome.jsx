import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DashboardHome = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const { data } = await api.get('/usage/summary');
        setUsage(data.usage || []);
      } catch (error) {
        console.error('Failed to fetch usage', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Welcome back, {user?.name}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Here's what's happening in your workspace.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Role</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{user?.role}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Tenant ID</dt>
          <dd className="mt-1 text-sm font-mono tracking-tight text-gray-900">{user?.tenantId}</dd>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 shadow rounded-lg">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Usage Overview</h3>
        <div className="h-72">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
