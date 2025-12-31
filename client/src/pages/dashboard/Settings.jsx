import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Building, 
  Globe, 
  CreditCard, 
  Activity, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Hash,
  Shield,
  LayoutDashboard
} from 'lucide-react';

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
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Building className="w-6 h-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Organization Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't retrieve your organization details. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-500 mt-1">Manage your workspace details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Card */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Building className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">General Information</h3>
              </div>
              {!isOwner && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
                  <Shield size={12} /> View Only
                </span>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 text-sm border border-green-100">
                  <CheckCircle size={16} /> {success}
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LayoutDashboard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isDisabled}
                    className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 py-2.5"
                    placeholder="My Company"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Allowed: letters, numbers, spaces, hyphens (-).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Domain
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tenant.domain || ''}
                    disabled
                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 text-gray-500 shadow-sm sm:text-sm py-2.5 cursor-not-allowed"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Your unique workspace identifier. Cannot be changed.
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Status Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Subscription Status</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">{tenant.plan}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Account Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    tenant.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenant.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Tenant ID</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {tenant._id?.slice(-8).toUpperCase() || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
