/**
 * App Header - QUOTE MASTER layout
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { useState } from 'react';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/project': 'Project',
  '/inventory': 'Inventory',
  '/masters': 'Masters',
  '/quotes': 'Quotes',
  '/templates': 'Templates',
  '/settings': 'Settings',
};

function getBreadcrumbs(pathname: string): string[] {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: string[] = ['Home'];
  let current = '';
  for (const part of parts) {
    current += `/${part}`;
    const label = breadcrumbMap[current] ?? part.charAt(0).toUpperCase() + part.slice(1);
    crumbs.push(label);
  }
  return crumbs;
}

export const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const breadcrumbs = getBreadcrumbs(location.pathname);

  const handleLogout = async () => {
    await dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-12 lg:h-14 shrink-0 flex items-center justify-between px-2 lg:px-4 gap-2 lg:gap-4">
      {/* Left: Logo + Hamburger */}
      <div className="flex items-center gap-2 lg:gap-3\">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-1.5 lg:p-2 rounded-lg bg-blue-600 text-white transition"
          aria-label="Toggle sidebar"
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Right: Icons + User */}
      <div className="flex items-center gap-2 lg:gap-4 ml-auto\">
        <div className="relative\">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 lg:gap-2 p-1 lg:p-2 rounded-lg hover:bg-gray-100 transition\">
            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0\">
              {user?.fullName
                ? user.fullName
                    .split(' ')
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                : user?.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span className="text-xs lg:text-xs font-medium text-gray-900 hidden sm:inline whitespace-nowrap\">
              {user?.fullName ?? user?.email ?? 'User'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 w-40 lg:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 top-full mt-1\">
              <Link
                to="/settings"
                className="block px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-50\"
                onClick={() => setDropdownOpen(false)}
              >
                Account Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left px-3 lg:px-4 py-2 text-xs lg:text-sm text-red-600 hover:bg-red-50 font-medium\"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-1 text-xs lg:text-sm text-gray-500\">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap\">
              {i > 0 && <span>/</span>}
              <span className={i === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
};
