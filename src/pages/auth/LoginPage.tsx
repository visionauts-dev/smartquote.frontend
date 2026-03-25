/**
 * Login Page - Professional split-screen design
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
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Left panel - Branding */}
      <div
        style={{
          flex: '0 0 42%',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.5px' }}>SQ</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.3px' }}>SmartQuote</span>
          </div>
        </div>

        {/* Main copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.8px' }}>
            Quotes & Projects,<br />
            <span style={{ color: '#93c5fd' }}>simplified.</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, margin: '0 0 32px' }}>
            Manage your product catalog, build accurate quotes, and track projects — all in one place.
          </p>

          {/* Feature list */}
          {[
            'Centralized product & vendor catalog',
            'Fast, accurate quote generation',
            'Project tracking & GA workspace',
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid rgba(37, 99, 235, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="10" height="10" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Bottom copyright */}
        <div style={{ position: 'relative', zIndex: 1, color: '#475569', fontSize: '12px' }}>
          © {new Date().getFullYear()} SmartQuote. All rights reserved.
        </div>
      </div>

      {/* Right panel - Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '40px 32px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Sign in to your SmartQuote account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '20px', padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <p style={{ fontSize: '13px', color: '#991b1b', margin: 0 }}>{error}</p>
              <button onClick={() => dispatch(clearError())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontSize: '16px', lineHeight: 1, flexShrink: 0, padding: '0' }}>×</button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : '#e2e8f0' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <Link to="#" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  style={{ ...inputStyle, paddingRight: '42px', borderColor: errors.password ? '#ef4444' : '#e2e8f0' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '4px' }}
                >
                  {showPassword ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                </button>
              </div>
              {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
            </div>

            {/* Remember me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#64748b' }}>
              <input type="checkbox" style={{ width: '15px', height: '15px', accentColor: '#2563eb' }} />
              Keep me signed in
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '11px', background: isLoading ? '#93c5fd' : '#2563eb',
                color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none',
                borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)'; } }}
              onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(37, 99, 235, 0.3)'; } }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: '8px',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#0f172a',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const errorStyle: React.CSSProperties = {
  marginTop: '5px',
  fontSize: '12px',
  color: '#ef4444',
};

export default LoginPage;

