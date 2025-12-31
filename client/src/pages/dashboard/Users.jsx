import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle, 
  UserX, 
  UserPlus, 
  Users as UsersIcon, 
  Mail, 
  Lock, 
  ArrowRight,
  MoreVertical,
  Shield,
  Trash2,
  Ban,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLimitError, setIsLimitError] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); // 'DISABLE', 'ENABLE', 'DELETE'
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [roleUpdating, setRoleUpdating] = useState(null);
  const [roleSuccess, setRoleSuccess] = useState(null);
  const [resendingInvite, setResendingInvite] = useState(null);

  const inputRef = useRef(null);

  const showMessage = (type, msg) => {
    if (type === 'error') {
      setGlobalError(msg);
      setTimeout(() => setGlobalError(''), 5000);
    } else {
      setGlobalSuccess(msg);
      setTimeout(() => setGlobalSuccess(''), 5000);
    }
  };

  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const canAccess = user?.role === 'OWNER' || user?.role === 'ADMIN';
  const isOwner = user?.role === 'OWNER';
  const isAdmin = user?.role === 'ADMIN';

  const fetchUsers = async () => {
    if (!canAccess) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/users');
      let list = [];
      if (Array.isArray(data)) {
        list = data.map(u => ({
          id: u._id,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt
        }));
      } else if (data.success && Array.isArray(data.data)) {
        list = data.data;
      } else {
        setError('Unexpected response format');
      }
      setUsers(list);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch users';
      setError(msg);
      if (err.response?.status === 403 && msg.includes('Usage limit exceeded')) {
        setIsLimitError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [canAccess]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');
    if (!inviteEmail || !inviteRole) {
      setInviteError('Email and role are required');
      return;
    }
    setInviteLoading(true);
    try {
      const { data } = await api.post('/users/invite', { email: inviteEmail, role: inviteRole });
      setInviteSuccess(data.message || 'User invited successfully');
      setInviteEmail('');
      setInviteRole('MEMBER');
      showMessage('success', `Invitation sent to ${inviteEmail}`);
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.status === 409 
        ? 'User already exists or invite sent' 
        : err.response?.data?.message || 'Failed to invite user';
      setInviteError(msg);
    } finally {
      setInviteLoading(false);
    }
  };

  const openActionModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setActionError('');
    setActionModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;
    setActionLoading(true);
    setActionError('');
    try {
      if (actionType === 'DISABLE') {
        await api.patch(`/users/${selectedUser.id}/disable`);
      } else if (actionType === 'ENABLE') {
        await api.patch(`/users/${selectedUser.id}/enable`);
      } else if (actionType === 'DELETE') {
        await api.delete(`/users/${selectedUser.id}`);
      }
      await fetchUsers();
      setActionModalOpen(false);
      showMessage('success', `User ${actionType.toLowerCase()}d successfully`);
      setSelectedUser(null);
      setActionType(null);
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${actionType.toLowerCase()} user`;
      setActionError(msg);
      if (err.response?.status === 403 || err.response?.status === 400) {
        showMessage('error', msg); // Also show global error for permission/safety issues
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setRoleUpdating(userId);
    setActionError(''); // Clear previous errors
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      await fetchUsers();
      showMessage('success', 'Role updated successfully');
      setRoleSuccess(userId);
      setTimeout(() => setRoleSuccess(null), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update role';
      showMessage('error', msg);
    } finally {
      setRoleUpdating(null);
    }
  };

  const handleResendInvite = async (userId) => {
    setResendingInvite(userId);
    try {
      const { data } = await api.post(`/users/${userId}/resend-invite`);
      showMessage('success', data.message || 'Invitation resent successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend invitation';
      showMessage('error', msg);
    } finally {
      setResendingInvite(null);
    }
  };

  if (!canAccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          You don't have permission to view this page. Only workspace owners and admins can manage users.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && isLimitError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden max-w-2xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Lock size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Usage Limit Reached</h2>
            <p className="text-red-100 mt-1">Your workspace has hit its monthly request limit.</p>
          </div>
        </div>
        <div className="p-8">
          <div className="prose text-gray-600 mb-6">
            <p>
              You have exceeded the maximum number of requests allowed for your current plan. 
              As a result, access to the user management list has been temporarily paused.
            </p>
            <p className="mt-2">
              To restore access immediately and unlock more features, please upgrade your plan.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard/billing" 
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg"
            >
              Upgrade Plan <ArrowRight size={18} />
            </Link>
            <Link 
              to="/dashboard" 
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const invitedUsers = users.filter(u => u.status === 'INVITED').length;

  const InviteModal = () => (
    <div className={`${showModal ? '' : 'hidden pointer-events-none'} fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all`}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Invite Team Member</h3>
          <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <UserX size={20} className="transform rotate-45" />
          </button>
        </div>
        <form onSubmit={async (e) => { await handleInvite(e); if (!inviteError) setShowModal(false); }} className="space-y-4">
          {inviteSuccess && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle size={16} />
              {inviteSuccess}
            </div>
          )}
          {inviteError && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {inviteError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                ref={inputRef}
                autoFocus
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(isOwner ? e.target.value : 'MEMBER')}
                disabled={isAdmin}
                className="px-4 py-2 border border-gray-200 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="MEMBER">Member</option>
                {isOwner && <option value="ADMIN">Admin</option>}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {inviteRole === 'ADMIN' 
                  ? 'Admins can manage users and billing.' 
                  : 'Members can view usage and metrics.'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setShowModal(false)} 
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={inviteLoading} 
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow flex items-center gap-2"
            >
              {inviteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ActionModal = () => {
    if (!actionType) return null;

    const config = {
      DISABLE: {
        title: 'Disable User',
        message: `Are you sure you want to disable ${selectedUser?.email}? They will no longer be able to access the workspace.`,
        icon: Ban,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
      },
      ENABLE: {
        title: 'Enable User',
        message: `Are you sure you want to enable ${selectedUser?.email}? They will regain access to the workspace.`,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        buttonColor: 'bg-green-600 hover:bg-green-700'
      },
      DELETE: {
        title: 'Remove User',
        message: `Are you sure you want to permanently remove ${selectedUser?.email}? This action cannot be undone.`,
        icon: Trash2,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        buttonColor: 'bg-red-600 hover:bg-red-700'
      }
    };

    const currentConfig = config[actionType];
    const Icon = currentConfig.icon;

    return (
      <div className={`${actionModalOpen ? '' : 'hidden pointer-events-none'} fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all`}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${currentConfig.bgColor}`}>
              <Icon size={24} className={currentConfig.color} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{currentConfig.title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{currentConfig.message}</p>
          
          {actionError && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {actionError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => setActionModalOpen(false)} 
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button 
              onClick={confirmAction} 
              disabled={actionLoading} 
              className={`px-4 py-2 rounded-lg text-white font-medium disabled:opacity-70 transition-all shadow-sm ${currentConfig.buttonColor}`}
            >
              {actionLoading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 mt-1">Manage access and roles for your workspace.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm hover:shadow flex items-center gap-2 self-start md:self-auto"
        >
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Now</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeUsers}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Invites</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{invitedUsers}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fadeIn">
          <AlertCircle size={20} />
          <span>{globalError}</span>
        </div>
      )}
      {globalSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={20} />
          <span>{globalSuccess}</span>
        </div>
      )}

      {/* Modals */}
      <InviteModal />
      <ActionModal />

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                        <UsersIcon size={24} className="text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-900">No users found</p>
                      <p className="text-sm text-gray-500">Get started by inviting team members.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{u.email}</span>
                          {u.createdAt && (
                            <span className="text-xs text-gray-400">
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isOwner && u.id !== user.id ? (
                        <div className="flex items-center gap-2">
                          {roleSuccess === u.id ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                              <CheckCircle size={12} />
                              <span>Updated</span>
                            </div>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={roleUpdating === u.id || u.status === 'DISABLED'}
                              className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 cursor-pointer hover:border-gray-300 transition-colors"
                            >
                              <option value="MEMBER">Member</option>
                              <option value="ADMIN">Admin</option>
                              <option value="OWNER">Owner</option>
                            </select>
                          )}
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'OWNER' ? 'bg-purple-100 text-purple-800' : 
                          u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role === 'OWNER' && <Shield size={10} className="mr-1" />}
                          {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        u.status === 'DISABLED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {u.status === 'ACTIVE' && <CheckCircle size={10} className="mr-1" />}
                        {u.status === 'DISABLED' && <Ban size={10} className="mr-1" />}
                        {u.status === 'INVITED' && <Mail size={10} className="mr-1" />}
                        {u.status.charAt(0) + u.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user?.id && (
                        <div className="flex items-center justify-end gap-2">
                          {u.status === 'INVITED' && (
                            <button
                              onClick={() => handleResendInvite(u.id)}
                              disabled={resendingInvite === u.id}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Resend Invite"
                            >
                              <RefreshCw size={16} className={resendingInvite === u.id ? 'animate-spin' : ''} />
                            </button>
                          )}
                          {u.status === 'DISABLED' ? (
                            <button 
                              onClick={() => openActionModal(u, 'ENABLE')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Enable User"
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => openActionModal(u, 'DISABLE')}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Disable User"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => openActionModal(u, 'DELETE')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
