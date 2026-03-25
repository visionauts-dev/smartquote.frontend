/**
 * App Header - SmartQuote top bar
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { useState } from 'react';

const pageTitles: Record<string, { title: string; description?: string }> = {
  '/project': { title: 'Projects', description: 'Manage your projects' },
  '/inventory': { title: 'Inventory', description: 'View inventory' },
  '/products': { title: 'Products', description: 'Manage product catalog' },
  '/products/create': { title: 'Add Product', description: 'Create a new product' },
  '/vendors': { title: 'Vendors', description: 'Manage vendors' },
  '/masters': { title: 'Masters', description: 'Manage master data' },
  '/quotes': { title: 'Quotes', description: 'Manage quotes' },
  '/quotes/new': { title: 'New Quote', description: 'Create a new quote' },
  '/settings': { title: 'Settings', description: 'Account & preferences' },
};

function getPageInfo(pathname: string) {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Edit page
  if (pathname.match(/^\/products\/\d+\/edit$/)) return { title: 'Edit Product', description: 'Update product details' };
  if (pathname.match(/^\/quotes\/\d+\/edit$/)) return { title: 'Edit Quote', description: 'Update quote' };
  if (pathname.match(/^\/quotes\/\d+$/)) return { title: 'Quote Details', description: 'View quote' };
  if (pathname.match(/^\/project\/.+\/ga\/.+\/workspace$/)) return { title: 'GA Workspace', description: 'General arrangement workspace' };
  // Prefix match
  for (const key of Object.keys(pageTitles).sort((a, b) => b.length - a.length)) {
    if (pathname.startsWith(key + '/') || pathname.startsWith(key)) return pageTitles[key];
  }
  return { title: 'SmartQuote' };
}

const UserInitials: React.FC<{ name?: string | null; email?: string | null }> = ({ name, email }) => {
  const initials = name
    ? name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : email?.[0]?.toUpperCase() ?? '?';
  return (
    <div
      style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
};

export const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pageInfo = getPageInfo(location.pathname);

  const handleLogout = async () => {
    await dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        height: '56px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        gap: '16px',
      }}
    >
      {/* Left: hamburger + page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '6px',
            border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer',
            color: '#64748b', flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#374151'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#64748b'; }}
          aria-label="Toggle sidebar"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {pageInfo.title}
          </h1>
          {pageInfo.description && (
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {pageInfo.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: user profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, position: 'relative' }}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 8px 4px 4px',
            border: '1px solid #e5e7eb', borderRadius: '8px',
            background: 'transparent', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <UserInitials name={user?.fullName} email={user?.email} />
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.fullName ?? user?.email ?? 'User'}
            </span>
            {user?.role && (
              <span style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.2 }}>
                {user.role}
              </span>
            )}
          </div>
          <svg
            style={{ width: '14px', height: '14px', color: '#94a3b8', transition: 'transform 0.15s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              onClick={() => setDropdownOpen(false)}
            />
            {/* Dropdown */}
            <div
              style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                width: '200px', background: '#fff',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                zIndex: 50, overflow: 'hidden',
                padding: '6px',
              }}
            >
              <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '6px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{user?.fullName ?? 'User'}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>
              <DropdownItem label="Settings" icon="⚙️" onClick={() => { setDropdownOpen(false); navigate('/settings'); }} />
              <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
              <DropdownItem label="Sign Out" icon="↩" onClick={handleLogout} danger />
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const DropdownItem: React.FC<{ label: string; icon: string; onClick: () => void; danger?: boolean }> = ({ label, icon, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 10px', borderRadius: '6px', border: 'none',
      background: 'transparent', cursor: 'pointer', textAlign: 'left',
      fontSize: '13px', color: danger ? '#ef4444' : '#374151',
      transition: 'background 0.1s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = danger ? '#fef2f2' : '#f8fafc'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
  >
    <span style={{ fontSize: '14px' }}>{icon}</span>
    {label}
  </button>
);

