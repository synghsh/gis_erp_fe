import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure, setRememberMe, clearError } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/globalSlice';
import type { RootState, AppDispatch } from '../../store';
import TextInput from '../../components/form/TextInput';
import PasswordInput from '../../components/form/PasswordInput';
import Button from '../../components/Button';
import FormWrapper from '../../components/form/FormWrapper';
import ThemeToggle from '../../components/layout/ThemeToggle';
import ThreeGlobeBg from './ThreeGlobeBg';
import './Auth.css';

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, rememberMe } = useSelector((state: RootState) => state.auth);
  
  // Interactive transaction log HUD state
  const [logText, setLogText] = useState<string>('READY TO AUTHENTICATE');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: rememberMe ? (localStorage.getItem('savedEmail') || '') : '',
      password: '',
      remember: rememberMe,
    }
  });

  // Clear global auth errors on mount
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginFormInputs) => {
    dispatch(loginStart());
    setLogText('INITIALIZING SECURE HANDSHAKE...');

    // Simulate multi-step handshake authentication stream
    setTimeout(() => {
      setLogText('CONNECTING TO GIS MASTER NODE...');
      
      setTimeout(() => {
        const validEmail = data.email.trim();
        
        if (data.password.length < 6) {
          dispatch(loginFailure('Password must be at least 6 characters.'));
          setLogText('ERROR: ENCRYPTION SIGNATURE INVALID');
          return;
        }

        setLogText('ESTABLISHING RSA-4096 LINK CHANNEL...');
        
        setTimeout(() => {
          const mockUser = {
            id: '1',
            name: 'Sayan Ghosh',
            email: validEmail,
            roleId: 1,
            roleName: 'Super Admin',
          };
          const mockToken = 'gis-mock-jwt-token-sayan-ghosh';

          dispatch(loginSuccess({ user: mockUser, token: mockToken }));
          
          if (data.remember) {
            dispatch(setRememberMe(true));
            localStorage.setItem('savedEmail', validEmail);
          } else {
            dispatch(setRememberMe(false));
            localStorage.removeItem('savedEmail');
          }

          dispatch(addToast({
            type: 'success',
            message: 'Successfully logged in as ' + mockUser.name
          }));
          
          navigate('/dashboard');
        }, 600);
      }, 700);
    }, 700);
  };

  return (
    <div className="login-page-container">
      {/* 1. FAINT CYBER-GRID HUD OVERLAY */}
      <div className="cyber-grid-overlay" />

      {/* 2. TOP HUD BANNER */}
      <div className="top-hud-bar">
        <span className="top-hud-title">GIS ERP ENGINE // SECURE GATEWAY</span>
        <div className="hud-live-indicator">
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)' }}>LIVE CHANNEL</span>
          <div className="hud-live-dot" />
        </div>
      </div>

      {/* 3. FLOATING THEME TOGGLE */}
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      {/* 4. SPLIT LAYOUT WRAPPER */}
      <div className="login-split-layout">
        
        {/* Left Panel: 3D particles globe and high-tech hero typography */}
        <div className="login-left-panel">
          <div className="login-hero-content">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="hero-badge">GEOSPATIAL SYSTEMS v2.1</div>
              <h1 className="hero-title">
                GIS ENTERPRISE<br />
                <span className="gradient-text">RESOURCE HUB</span>
              </h1>
              <p className="hero-subtitle">
                Streamlining spatial assets, surveyor workforce operations, and master data nodes in a unified enterprise interface.
              </p>
            </motion.div>
          </div>

          {/* Small centered globe section below header */}
          <div className="login-globe-section">
            <div className="login-globe-wrapper">
              <ThreeGlobeBg />
            </div>

            {/* Dynamic stats HUD instrumentation panel aligned below globe */}
            <motion.div
              className="hero-stats-hud"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <div className="stat-hud-item">
                <span className="stat-hud-value">99.98%</span>
                <span className="stat-hud-label">Uptime Status</span>
              </div>
              <div className="stat-hud-divider" />
              <div className="stat-hud-item">
                <span className="stat-hud-value">4096-bit</span>
                <span className="stat-hud-label">Encryption</span>
              </div>
              <div className="stat-hud-divider" />
              <div className="stat-hud-item">
                <span className="stat-hud-value">ACTIVE</span>
                <span className="stat-hud-label">GPS Channels</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel: Centers the login form card */}
        <div className="login-right-panel">
          {/* Rotating colorful blurry spheres in background */}
          <div className="bg-aurora-blobs">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
          </div>

          <motion.div
            className="login-card"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          >
            <div className="login-header">
              <div className="login-logo">
                <Globe size={20} />
              </div>
              <h2 className="login-title">SURVEYOR ACCESS</h2>
              <p className="login-subtitle">VERIFY FIELD GATEWAY CREDENTIALS</p>
            </div>

            {/* Global Error Banner */}
            {error && (
              <div className="login-error-alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
              <TextInput
                label="Email Address"
                placeholder="admin@gis-erp.com"
                type="email"
                icon={Mail}
                error={errors.email}
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                })}
              />

              {/* Password Input */}
              <PasswordInput
                label="Password"
                placeholder="Enter password"
                error={errors.password}
                required
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              {/* Remember Me and Forgot password link */}
              <div className="login-form-options">
                <label className="remember-me-checkbox">
                  <input
                    type="checkbox"
                    {...register('remember')}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  className="forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(addToast({
                      type: 'info',
                      message: 'Forgot password thunk mock triggered. Check console.'
                    }));
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="login-submit-btn"
                isLoading={isLoading}
                size="md"
              >
                AUTHORIZE & LINK CHANNEL
              </Button>
            </FormWrapper>

            {/* 6. REALTIME LOGS TRANSACTION HUD */}
            <div className="login-logs-hud">
              <div className="logs-hud-header">
                <span className="logs-hud-title">TRANSACTION STREAM</span>
                <div className={`logs-hud-indicator ${isLoading ? 'active' : ''}`} />
              </div>
              <span className={`logs-hud-text ${logText.startsWith('ERROR') ? 'logs-hud-text-error' : ''}`}>
                &gt; {logText}
              </span>
            </div>
          </motion.div>

          {/* HUD FOOTER DETAILS */}
          <div className="login-footer-info">
            <span className="login-footer-text">SECURE SESSION // RSA-4096 LAYER // EXP-V56</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
