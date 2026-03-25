/**
 * Main App Layout - SmartQuote (sidebar + header + content)
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { Toast } from '../ui/Toast';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

export const MainLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: '#f1f5f9' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <AppHeader />
        <main style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          <Outlet />
        </main>
      </div>
      <Toast />
      <ConfirmDeleteModal />
    </div>
  );
};
