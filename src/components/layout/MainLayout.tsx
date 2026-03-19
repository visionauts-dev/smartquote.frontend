/**
 * Main App Layout - QUOTE MASTER (sidebar + header + content)
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { Toast } from '../ui/Toast';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      <Toast />
      <ConfirmDeleteModal />
    </div>
  );
};
