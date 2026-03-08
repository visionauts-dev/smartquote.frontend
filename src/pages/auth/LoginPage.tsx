/**
 * Login Page - Full Screen, No Scroll
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { login, clearError } from '../../redux/slices/authSlice';
import { type LoginRequest } from '../../types/auth.types';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    navigate('/project');
  }

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate('/project');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center text-white px-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-3">Smart Quote</h1>
          <p className="text-xl opacity-90 mb-6">Professional Quote Management System</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <div>
                <p className="font-semibold">Fast & Reliable</p>
                <p className="text-sm opacity-75">Create and manage quotes in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <div>
                <p className="font-semibold">Secure Platform</p>
                <p className="text-sm opacity-75">Enterprise-grade security for your data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <div>
                <p className="font-semibold">Easy Integration</p>
                <p className="text-sm opacity-75">Seamless workflow with your business tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl px-7 py-6">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-block p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="text-xs font-medium">{error}</p>
              <button
                onClick={() => dispatch(clearError())}
                className="text-xs underline mt-1 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition pr-10 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 bg-transparent! "
                >
                  {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <Link to="#" className="text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">Don't have an account?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/register"
            className="w-full block text-center py-2 border border-gray-300 text-gray-700 text-sm rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Create Account
          </Link>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-3">
            By signing in, you agree to our{' '}
            <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
            {' and '}
            <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;