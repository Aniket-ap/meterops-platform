import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Settings = () => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      setError('');
      try {
        const { data } = await api.get('/users/me');
        const t = data?.success ? data.data?.tenant : data?.tenant;
        setTenant(t || null);
        setName((t && t.name) || '');
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const isOwner = user?.role === 'OWNER';
  const isDisabled = !isOwner;

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const trimmed = (name || '').trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    if (!/^[A-Za-z0-9\- ]+$/.test(trimmed)) {
      setError('Use only letters, numbers, spaces, and hyphens (-)');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.patch('/tenants/me', { name: trimmed });
      if (data?.success) {
        setSuccess(data.message || 'Settings saved');
        setTenant({
          ...(tenant || {}),
          name: trimmed,
        });
      } else {
        setError(data?.message || 'Failed to save settings');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save settings';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Organization Settings</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : !tenant ? (
            <div className="text-gray-500">No tenant information available.</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {success && <div className="text-green-600">{success}</div>}
              {error && <div className="text-red-600">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isDisabled}
                  className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Allowed: letters, numbers, spaces, hyphens (-). Avoid emojis or special symbols.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">{tenant.domain}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">{tenant.plan}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">{tenant.status}</div>
                </div>
              </div>

              {isOwner && (
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-hover transition-all transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
