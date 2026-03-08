/**
 * Home Page - Professional Landing
 */

import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-secondary">
      {/* Header Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Smart Quote</h1>
          {isAuthenticated && (
            <Link
              to="/project"
              className="px-6 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Go to Project
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main Content */}
          <div className="mb-12">
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              Professional Quote Management
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Streamline your quoting process with Smart Quote. Create, manage, and track quotes effortlessly with our modern platform.
            </p>

            {!isAuthenticated && (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 shadow-lg transition transform hover:scale-105"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-opacity-90 shadow-lg transition transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="opacity-80">Create quotes in seconds with our intuitive interface</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Secure</h3>
              <p className="opacity-80">Enterprise-grade security for your valuable data</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Analytics</h3>
              <p className="opacity-80">Track and analyze your quote performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
