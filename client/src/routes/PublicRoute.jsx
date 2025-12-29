import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { token } = useAuth();
  return !token ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
