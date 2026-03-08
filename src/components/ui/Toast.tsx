/**
 * Toast notification - reads from Redux ui.toast
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { clearToast } from '../../redux/slices/uiSlice';

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), 4000);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;

  const bg =
    toast.type === 'success'
      ? 'bg-green-600'
      : toast.type === 'error'
        ? 'bg-red-600'
        : 'bg-blue-600';

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div
        className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4`}
      >
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          type="button"
          onClick={() => dispatch(clearToast())}
          className="text-white/90 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
