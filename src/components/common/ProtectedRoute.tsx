/**
 * Protected Route Component
 */

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppHooks';
import type { RootState } from '../../redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
