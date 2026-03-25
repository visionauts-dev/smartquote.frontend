/**
 * Navigation Bar - Professional Header
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { logout } from '../../redux/slices/authSlice';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition">
              SQ
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition">Smart Quote</span>
          </Link>

          {/* Center Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              {/* TODO: Uncomment when dashboard is ready */}
              {/* <Link
                to="/dashboard"
                className={`text-sm font-medium transition ${
                  location.pathname === '/dashboard'
                    ? 'text-primary border-b-2 border-primary pb-4'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link> */}
              <Link
                to="/quotes"
                className={`text-sm font-medium transition ${
                  location.pathname.startsWith('/quotes')
                    ? 'text-primary border-b-2 border-primary pb-4'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quotes
              </Link>
              <Link
                to="/templates"
                className={`text-sm font-medium transition ${
                  location.pathname.startsWith('/templates')
                    ? 'text-primary border-b-2 border-primary pb-4'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Templates
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition group"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold group-hover:shadow-md transition">
                    {user?.fullName
                      ? user.fullName
                          .split(' ')
                          .slice(0, 2)
                          .map((n: any) => n[0])
                          .join('')
                          .toUpperCase()
                      : user?.email?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.role || user?.email}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      Help & Support
                    </a>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-linear-to-r from-primary to-secondary text-white text-sm font-semibold rounded-lg hover:shadow-md transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
