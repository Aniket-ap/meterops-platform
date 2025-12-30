import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <div className="text-lg font-bold text-gray-800">{tenant?.name || 'Workspace'}</div>
          <div className="text-sm text-gray-500">{user?.role || 'Role'}</div>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            Dashboard
          </NavLink>
          {user?.role !== 'MEMBER' && (
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              Users
            </NavLink>
          )}
          <NavLink
            to="/dashboard/usage"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            Usage
          </NavLink>
          {user?.role === 'OWNER' && (
            <NavLink
              to="/dashboard/billing"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              Billing
            </NavLink>
          )}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="font-semibold text-gray-800">MeterOps Dashboard</div>
          <div className="text-sm text-gray-600">
            {user?.email || ''} • {tenant?.domain || ''}
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
