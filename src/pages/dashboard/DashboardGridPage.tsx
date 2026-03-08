/**
 * Dashboard grid - loads when Dashboard menu selected
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppHooks';
import { Button } from '../../components/ui/Button';
import type { Quote } from '../../types/quote.types';

const DashboardGridPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const quotes = useAppSelector((state) => state.quotes.items) as Quote[];

  const totalQuotes = quotes.length;
  const accepted = quotes.filter((q) => q.status === 'accepted').length;
  const inProgress = quotes.filter((q) => q.status === 'sent' || q.status === 'viewed').length;
  const totalValue = quotes.filter((q) => q.status === 'accepted').reduce((s, q) => s + q.totalAmount, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName ?? user?.email}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Total Quotes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalQuotes}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <p className="text-sm text-green-700 font-medium">Accepted</p>
              <p className="text-2xl font-bold text-green-800 mt-1">{accepted}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <p className="text-sm text-amber-700 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-amber-800 mt-1">{inProgress}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Total Value</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recent Quotes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.slice(0, 10).map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/quotes/${q.id}`} className="text-blue-600 hover:underline font-medium">
                        {q.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{q.clientName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{q.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Link to={`/quotes/${q.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {quotes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">No quotes yet.</p>
              <Link to="/quotes/new">
                <Button>Create Quote</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardGridPage;
