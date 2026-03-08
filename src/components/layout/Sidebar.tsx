/**
 * Sidebar navigation - QUOTE MASTER layout
 */

import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppHooks';
import { useState } from 'react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: GridIcon },
  { path: '/project', label: 'Project', icon: GridIcon },
  { path: '/sales', label: 'Sales', icon: ChartIcon, hasSubmenu: false },
  {
    path: '/inventory', label: 'Inventory', icon: BoxIcon, hasSubmenu: true, children: [
      { path: '/inventory/products', label: 'Products' },
      { path: '/inventory/vendors', label: 'Vendors' },
    ],
  },
  {
    path: '/masters', label: 'Masters', icon: UsersIcon, hasSubmenu: true, children: [
      { path: '/masters/addons', label: 'Add-Ons' },
    ],
  },
];

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 min-h-screen">
      <nav className="p-4 space-y-1">
        <Link to="/dashboard" className="flex items-center gap-2 py-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-gray-900">
            <span className="text-blue-600">QUOTE</span> <span className="text-amber-500">MASTER</span>
          </span>
        </Link>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <div key={item.path}>
              <Link
                to={item.path}
                onClick={() => item.hasSubmenu && toggleExpand(item.path)}
                className={`
                  flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive
                    ? '!bg-blue-600 !text-white'
                    : '!text-gray-600 !hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedItems[item.path] ? 'rotate-180' : ''}`}
                  />
                )}
              </Link>
              {item.hasSubmenu && expandedItems[item.path] && (
                <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                  {item.children?.map((child) => {
                    const isChildActive = location.pathname === child.path;

                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block py-1.5 text-sm rounded-md px-2 transition
            ${isChildActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
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
    </aside>
  );
};
