/**
 * Main App Router
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks/useAppHooks';
import { initializeAuth } from './redux/slices/authSlice';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardGridPage from './pages/dashboard/DashboardGridPage';
import ProjectPage from './pages/project/ProjectPage';
import ProjectDetailPage from './pages/project/ProjectDetailPage';
import SalesGridPage from './pages/sales/SalesGridPage';
import InventoryGridPage from './pages/inventory/InventoryGridPage';
import ProductsGridPage from './pages/inventory/ProductsGridPage';
import MastersGridPage from './pages/masters/MastersGridPage';
import VendorsGridPage from './pages/masters/VendorsGridPage';
import QuotesPage from './pages/quotes/QuotesPage';
import QuoteCreatePage from './pages/quotes/QuoteCreatePage';
import QuoteDetailPage from './pages/quotes/QuoteDetailPage';
import QuoteEditPage from './pages/quotes/QuoteEditPage';
import TemplatesPage from './pages/templates/TemplatesPage';
import TemplateCreatePage from './pages/templates/TemplateCreatePage';
import SettingsPage from './pages/settings/SettingsPage';

// Components
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardGridPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project"
            element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <SalesGridPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryGridPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsGridPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/masters"
            element={
              <ProtectedRoute>
                <MastersGridPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute>
                <VendorsGridPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotes"
            element={
              <ProtectedRoute>
                <QuotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotes/new"
            element={
              <ProtectedRoute>
                <QuoteCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotes/:id"
            element={
              <ProtectedRoute>
                <QuoteDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotes/:id/edit"
            element={
              <ProtectedRoute>
                <QuoteEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <TemplatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates/new"
            element={
              <ProtectedRoute>
                <TemplateCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
