import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';

const AcceptInvite = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const token = params.get('token') || '';

  useEffect(() => {
    if (!token) {
      setError('Invalid invite link');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError('Invalid invite link');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/users/accept-invite', { token, password });
      if (data?.success || data?.message) {
        setSuccess(data.message || 'Invitation accepted successfully');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError('Failed to accept invitation');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to accept invitation';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Accept Invitation</h1>
        <p className="text-sm text-gray-600 mt-1">Join your company workspace.</p>

        {error && <div className="mt-4 bg-red-50 text-red-700 px-4 py-2 rounded">{error}</div>}
        {success && <div className="mt-4 bg-green-50 text-green-700 px-4 py-2 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4"
              placeholder="StrongPassword@123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Accept Invitation'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
