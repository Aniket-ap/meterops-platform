import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">User Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="font-mono text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{user.status}</span>
              </div>
            </div>
          </div>

          {/* Tenant Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Tenant Info</h2>
            {tenant ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium">{tenant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Domain:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{tenant.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan:</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">{tenant.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{tenant.status}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No tenant information available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;