import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { AlertCircle, CheckCircle, UserX, UserPlus, Users as UsersIcon, Mail } from 'lucide-react';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 font-semibold">Access restricted</div>
        <div className="text-gray-600 text-sm mt-2">Only OWNER and ADMIN can view users.</div>
      </div>
    );
  }

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 font-semibold">Error</div>
        <div className="text-gray-600 text-sm mt-2">{error}</div>
      </div>
    );
  }

  const InviteModal = () => (
    <div className={`${showModal ? '' : 'hidden pointer-events-none'} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Invite User</h3>
          <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={async (e) => { await handleInvite(e); if (!inviteError) setShowModal(false); }} className="space-y-4">
          {inviteSuccess && <div className="bg-green-50 text-green-700 px-4 py-2 rounded">{inviteSuccess}</div>}
          {inviteError && <div className="bg-red-50 text-red-700 px-4 py-2 rounded">{inviteError}</div>}
          <div className="space-y-3">
            <input
              ref={inputRef}
              autoFocus
              type="email"
              placeholder="user@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full bg-gray-50"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(isOwner ? e.target.value : 'MEMBER')}
              disabled={isAdmin}
              className="px-3 py-2 border rounded-lg w-full bg-gray-50 disabled:opacity-60"
            >
              <option value="MEMBER">MEMBER</option>
              {isOwner && <option value="ADMIN">ADMIN</option>}
            </select>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800">Cancel</button>
            <button type="submit" disabled={inviteLoading} className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-60">
              {inviteLoading ? 'Inviting...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ActionModal = () => {
    if (!actionType) return null;

    const titles = {
      DISABLE: 'Disable User',
      ENABLE: 'Enable User',
      DELETE: 'Remove User',
    };

    const messages = {
      DISABLE: `Are you sure you want to disable ${selectedUser?.email}? They will no longer be able to access the workspace.`,
      ENABLE: `Are you sure you want to enable ${selectedUser?.email}? They will regain access to the workspace.`,
      DELETE: `Are you sure you want to permanently remove ${selectedUser?.email}? This action cannot be undone.`,
    };

    const buttonStyles = {
      DISABLE: 'bg-red-600 hover:bg-red-700',
      ENABLE: 'bg-green-600 hover:bg-green-700',
      DELETE: 'bg-red-600 hover:bg-red-700',
    };

    return (
      <div className={`${actionModalOpen ? '' : 'hidden pointer-events-none'} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{titles[actionType]}</h3>
          <p className="text-sm text-gray-600 mb-4">{messages[actionType]}</p>
          
          {actionError && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 text-sm">{actionError}</div>}

          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => setActionModalOpen(false)} 
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button 
              onClick={confirmAction} 
              disabled={actionLoading} 
              className={`px-4 py-2 rounded-lg text-white disabled:opacity-60 ${buttonStyles[actionType]}`}
            >
              {actionLoading ? 'Processing...' : titles[actionType].split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {globalError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{globalError}</span>
        </div>
      )}
      {globalSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          <span>{globalSuccess}</span>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Users</h2>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">Manage workspace members</div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg bg-primary text-white">
          Invite User
        </button>
      </div>
      <InviteModal />
      <ActionModal />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-gray-600">Email</th>
              <th className="px-4 py-2 text-gray-600">Role</th>
              <th className="px-4 py-2 text-gray-600">Status</th>
              <th className="px-4 py-2 text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UsersIcon size={24} className="text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900">No users found</p>
                    <p className="text-sm text-gray-500">Get started by inviting team members.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <span>{u.email}</span>
                      {/* Optional: Show joined date if available, but backend needs to send createdAt. 
                          Assuming backend sends it now. */}
                      {u.createdAt && <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {isOwner && u.id !== user.id ? (
                      <div className="flex items-center gap-2">
                        {roleSuccess === u.id ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-semibold px-2 py-1">
                            <CheckCircle size={14} />
                            <span>Updated!</span>
                          </div>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={roleUpdating === u.id || u.status === 'DISABLED'}
                            className="px-2 py-1 border rounded text-xs font-semibold bg-white disabled:opacity-50"
                          >
                            <option value="MEMBER">MEMBER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="OWNER">OWNER</option>
                          </select>
                        )}
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'OWNER' ? 'bg-purple-100 text-purple-800' : 
                        u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      u.status === 'DISABLED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {u.id !== user?.id && (
                      <div className="flex items-center justify-end gap-3">
                        {u.status === 'INVITED' && (
                          <button
                            onClick={() => handleResendInvite(u.id)}
                            disabled={resendingInvite === u.id}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                          >
                            {resendingInvite === u.id ? 'Sending...' : 'Resend'}
                          </button>
                        )}
                        {u.status === 'DISABLED' ? (
                          <button 
                            onClick={() => openActionModal(u, 'ENABLE')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Enable
                          </button>
                        ) : (
                          <button 
                            onClick={() => openActionModal(u, 'DISABLE')}
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                          >
                            Disable
                          </button>
                        )}
                        <button 
                          onClick={() => openActionModal(u, 'DELETE')}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
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
  );
};

export default Users;
