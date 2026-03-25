/**
 * Sidebar navigation - SmartQuote professional dark sidebar
 */

import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppHooks';
import { useState, useEffect } from 'react';

const menuItems = [
  { path: '/project', label: 'Projects', icon: ProjectIcon },
  {
    path: '/inventory', label: 'Inventory', icon: BoxIcon, hasSubmenu: true, children: [
      { path: '/products', label: 'Products' },
      { path: '/vendors', label: 'Vendors' },
    ],
  },
  {
    path: '/masters', label: 'Masters', icon: SettingsIcon, hasSubmenu: true, children: [
      { path: '/addons', label: 'Add-Ons' },
    ],
  },
  { path: '/quotes', label: 'Quotes', icon: QuoteIcon },
];

function ProjectIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function QuoteIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function BoxIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function SettingsIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function GearIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ChevronDown({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      style={{
        width: '14px', height: '14px',
        transition: 'transform 0.2s',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (
      location.pathname.startsWith('/inventory') ||
      location.pathname.startsWith('/products') ||
      location.pathname.startsWith('/vendors')
    ) {
      setExpandedItems((prev) => ({ ...prev, '/inventory': true }));
    }
    if (location.pathname.startsWith('/masters') || location.pathname.startsWith('/addons')) {
      setExpandedItems((prev) => ({ ...prev, '/masters': true }));
    }
  }, [location.pathname]);

  const toggleExpand = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  if (!sidebarOpen) return null;

  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
        }}
      >
        <Link to="/project" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.5px' }}>SQ</span>
          </div>
          <div>
            <div style={{ color: '#111827', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              SmartQuote
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Workspace
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <div style={{ marginBottom: '4px', padding: '0 8px 6px', color: '#9ca3af', fontSize: '10px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          Navigation
        </div>

        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/settings' && location.pathname.startsWith(item.path + '/')) ||
            item.children?.some((c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/'));
          const isExpanded = expandedItems[item.path];
          const Icon = item.icon;

          return (
            <div key={item.path} style={{ marginBottom: '2px' }}>
              {item.hasSubmenu ? (
                <button
                  type="button"
                  onClick={(e) => toggleExpand(item.path, e)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#6b7280',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#f3f4f6';
                    if (!isActive) e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isActive ? '#1d4ed8' : '#6b7280';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown isOpen={isExpanded} />
                </button>
              ) : (
                <Link
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#6b7280',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#f3f4f6';
                    if (!isActive) e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isActive ? '#1d4ed8' : '#6b7280';
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>{item.label}</span>
                </Link>
              )}

              {/* Submenu */}
              {item.hasSubmenu && isExpanded && (
                <div style={{ marginTop: '2px', marginLeft: '16px', paddingLeft: '20px', borderLeft: '1px solid #e5e7eb' }}>
                  {item.children?.map((child) => {
                    const isChildActive = location.pathname === child.path || location.pathname.startsWith(child.path + '/');
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        style={{
                          display: 'block',
                          padding: '6px 10px',
                          borderRadius: '5px',
                          fontSize: '13px',
                          color: isChildActive ? '#1d4ed8' : '#6b7280',
                          fontWeight: isChildActive ? 600 : 400,
                          background: isChildActive ? '#dbeafe' : 'transparent',
                          textDecoration: 'none',
                          marginBottom: '1px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isChildActive) {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#374151';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isChildActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                          }
                        }}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
        <div style={{ padding: '6px 10px', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
          v1.0.0 &nbsp;·&nbsp; SmartQuote
        </div>
      </div>
    </aside>
  );
};

