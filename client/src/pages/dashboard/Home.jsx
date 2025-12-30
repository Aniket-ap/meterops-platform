import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const { user, tenant } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(null);
  const [usageTotal, setUsageTotal] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: meData }, usersRes, usageRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/users').catch((e) => e),
          api.get('/usage/summary').catch((e) => e),
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
          setTotalUsers(Array.isArray(u) ? u.length : null);
        } else {
          setTotalUsers(null);
        }
        if (usageRes?.data) {
          const raw = usageRes.data.success ? usageRes.data.data : usageRes.data;
          const sum = Array.isArray(raw) ? raw.reduce((acc, i) => acc + (i.total || 0), 0) : 0;
          setUsageTotal(sum);
        } else {
          setUsageTotal(0);
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
  const planBadgeClass =
    resolvedTenant?.plan === 'PRO'
      ? 'bg-indigo-100 text-indigo-800'
      : resolvedTenant?.plan === 'ENTERPRISE'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-purple-100 text-purple-800';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-800">{resolvedTenant?.name || 'Workspace'}</div>
              <div className="mt-1 text-sm text-gray-600">{resolvedTenant?.domain || ''}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${planBadgeClass}`}>
                {resolvedTenant?.plan || '—'}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                {resolvedTenant?.status || '—'}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {resolvedUser?.role || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{totalUsers ?? '—'}</div>
            <div className="text-xs text-gray-500 mt-1">Workspace members</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-500">Usage Today</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{usageTotal}</div>
            <div className="text-xs text-gray-500 mt-1">Feature events</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-500">Current Plan</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{resolvedTenant?.plan || '—'}</div>
            <div className="text-xs text-gray-500 mt-1">From account</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-500">Billing Status</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">—</div>
            <div className="text-xs text-gray-500 mt-1">Placeholder</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-xl font-semibold text-gray-800 mb-4">Next Steps</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {totalUsers === 1 && (
              <a href="/dashboard/users" className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow transition">
                <div className="font-medium text-gray-800">Invite your team</div>
                <div className="text-sm text-gray-500 mt-1">Add members to collaborate</div>
              </a>
            )}
            {usageTotal === 0 && (
              <a href="/dashboard/usage" className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow transition">
                <div className="font-medium text-gray-800">Start using APIs</div>
                <div className="text-sm text-gray-500 mt-1">Track feature usage</div>
              </a>
            )}
            {resolvedTenant?.plan === 'FREE' && (
              <a href="/dashboard/billing" className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow transition">
                <div className="font-medium text-gray-800">Upgrade your plan</div>
                <div className="text-sm text-gray-500 mt-1">Unlock higher limits</div>
              </a>
            )}
            {!totalUsers || usageTotal > 0 || resolvedTenant?.plan !== 'FREE' ? (
              <a href="/dashboard/settings" className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow transition">
                <div className="font-medium text-gray-800">Review organization settings</div>
                <div className="text-sm text-gray-500 mt-1">Manage workspace details</div>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
