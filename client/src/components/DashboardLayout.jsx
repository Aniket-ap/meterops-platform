import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from './common/SEO';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/users', label: 'Users', icon: Users, restricted: user?.role === 'MEMBER' },
    { to: '/dashboard/usage', label: 'Usage', icon: Activity },
    { to: '/dashboard/billing', label: 'Billing', icon: CreditCard, restricted: user?.role !== 'OWNER' },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const item = navItems.find(item => {
      if (item.end) return location.pathname === item.to;
      return location.pathname.startsWith(item.to);
    });
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SEO 
        title={getPageTitle()} 
        description="MeterOps Dashboard - Manage your metering and billing infrastructure."
      />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              M
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">MeterOps</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            Menu
          </div>
          {navItems.map((item) => {
            if (item.restricted) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary/5 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={20} 
                      className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm border-2 border-white shadow-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                {tenant?.name || 'Workspace'}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {navItems.find(item => {
                if (item.end) return location.pathname === item.to;
                return location.pathname.startsWith(item.to);
              })?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{tenant?.domain}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
