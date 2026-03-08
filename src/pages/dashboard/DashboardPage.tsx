/**
 * Dashboard Page - Professional User Dashboard
 */

import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppHooks';
import { Button } from '../../components/ui/Button';
import type { Quote } from '../../types/quote.types';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const quotes = useAppSelector((state) => state.quotes.items) as Quote[];
  const totalQuotes = quotes.length;
  const accepted = quotes.filter((q: Quote) => q.status === 'accepted').length;
  const inProgress = quotes.filter((q: Quote) => q.status === 'sent' || q.status === 'viewed').length;
  const totalValue = quotes.filter((q: Quote) => q.status === 'accepted').reduce((s: number, q: Quote) => s + q.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName || user?.email}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's an overview of your Smart Quote account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Quotes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalQuotes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📄</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Accepted</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{accepted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">✓</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-primary mt-2">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center text-2xl">💰</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.firstName ? user.firstName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName || user?.email}
                  </h3>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                <dl className="grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Full Name</dt>
                    <dd className="mt-1 text-lg text-gray-900">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : 'Not provided'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Email Address</dt>
                    <dd className="mt-1 text-lg text-gray-900">{user?.email}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex gap-4">
                <Link to="/settings">
                  <Button>Edit Profile</Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline">Change Password</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/quotes/new" className="block">
                  <Button fullWidth>+ New Quote</Button>
                </Link>
                <Link to="/templates" className="block">
                  <Button fullWidth variant="outline">View Templates</Button>
                </Link>
                <Link to="/quotes" className="block">
                  <Button fullWidth variant="outline">Recent Quotes</Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-primary bg-opacity-10 rounded-lg border border-primary border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Pro Tip</h3>
              <p className="text-gray-700 text-sm">
                Use templates to create quotes faster and maintain consistency across your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
