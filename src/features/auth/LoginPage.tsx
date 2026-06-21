import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure, setRememberMe, clearError } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/globalSlice';
import type { RootState, AppDispatch } from '../../store';
import { LoginAdminAction } from '../../store/actions/authAction';
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
          const encodedPassword = btoa(data.password);
          dispatch(
            LoginAdminAction({
              username: validEmail,
              password: encodedPassword,
            })
          )
            .then(() => {
              if (data.remember) {
                dispatch(setRememberMe(true));
                localStorage.setItem('savedEmail', validEmail);
              } else {
                dispatch(setRememberMe(false));
                localStorage.removeItem('savedEmail');
              }

              dispatch(
                addToast({
                  type: 'success',
                  message: 'Successfully authorized and logged in',
                })
              );

              navigate('/dashboard');
            })
            .catch((err: any) => {
              setLogText('ERROR: AUTHENTICATION FAILED');
              const errMsg =
                err?.response?.data?.Errors ||
                err?.response?.data?.Message ||
                err?.message ||
                'Authentication credentials invalid';
              dispatch(loginFailure(String(errMsg)));
              dispatch(
                addToast({
                  type: 'error',
                  message: String(errMsg),
                })
              );
            });
        }, 600);
      }, 700);
    }, 700);
  };

  return (
    <div className="login-page-container">
      {/* 1. FAINT CYBER-GRID HUD OVERLAY */}
      <div className="cyber-grid-overlay" />

      {/* 2. TOP HUD BANNER */}
      {/* <div className="top-hud-bar">
        <span className="top-hud-title">GIS ERP ENGINE // SECURE GATEWAY</span>
        <div className="hud-live-indicator">
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)' }}>LIVE CHANNEL</span>
          <div className="hud-live-dot" />
        </div>
      </div> */}

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
              <h2 className="login-title">ADMIN ACCESS</h2>
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
            {/* <div className="login-logs-hud">
              <div className="logs-hud-header">
                <span className="logs-hud-title">TRANSACTION STREAM</span>
                <div className={`logs-hud-indicator ${isLoading ? 'active' : ''}`} />
              </div>
              <span className={`logs-hud-text ${logText.startsWith('ERROR') ? 'logs-hud-text-error' : ''}`}>
                &gt; {logText}
              </span>
            </div> */}
          </motion.div>

          {/* DENSE RADIATING ELECTRICAL CIRCUIT SCHEMATIC BACKGROUND */}
          <div className="circuit-bg-container">
            <svg className="circuit-bg-svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central Pulsing Ambient Glow (Imagination/Premium visual) */}
              <defs>
                <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                </radialGradient>
              </defs>
              <circle cx="400" cy="400" r="300" fill="url(#centralGlow)" />

              {/* Static Background Circuit Paths (Faded Blueprint Traces) */}
              {/* Top-Left Quadrant Trunks & Branches */}
              <path className="circuit-line-static" d="M 380,380 L 260,260 L 120,260 L 0,140" />
              <path className="circuit-line-static" d="M 376,384 L 256,264 L 118,264 L 0,146" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 300,300 L 200,300 L 100,300 L 0,200" /> {/* Branch TL-1 */}
              <path className="circuit-line-static" d="M 280,280 L 280,180 L 180,80 L 0,80" />   {/* Branch TL-2 */}

              {/* Top-Right Quadrant Trunks & Branches */}
              <path className="circuit-line-static" d="M 420,380 L 540,260 L 680,260 L 800,140" />
              <path className="circuit-line-static" d="M 424,384 L 544,264 L 682,264 L 800,146" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 500,300 L 600,300 L 700,300 L 800,200" /> {/* Branch TR-1 */}
              <path className="circuit-line-static" d="M 520,280 L 520,180 L 620,80 L 800,80" />   {/* Branch TR-2 */}

              {/* Bottom-Right Quadrant Trunks & Branches */}
              <path className="circuit-line-static" d="M 420,420 L 540,540 L 680,540 L 800,660" />
              <path className="circuit-line-static" d="M 424,416 L 544,536 L 682,536 L 800,654" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 500,500 L 600,500 L 700,500 L 800,600" /> {/* Branch BR-1 */}
              <path className="circuit-line-static" d="M 520,520 L 520,620 L 620,720 L 800,720" />   {/* Branch BR-2 */}

              {/* Bottom-Left Quadrant Trunks & Branches */}
              <path className="circuit-line-static" d="M 380,420 L 260,540 L 120,540 L 0,660" />
              <path className="circuit-line-static" d="M 376,416 L 256,536 L 118,536 L 0,654" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 300,500 L 200,500 L 100,500 L 0,600" /> {/* Branch BL-1 */}
              <path className="circuit-line-static" d="M 280,520 L 280,620 L 180,720 L 0,720" />   {/* Branch BL-2 */}

              {/* Vertical Top Axial Lines */}
              <path className="circuit-line-static" d="M 400,360 L 400,200 L 350,150 L 350,0" />
              <path className="circuit-line-static" d="M 405,360 L 405,202 L 355,152 L 355,0" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 400,260 L 340,200 L 340,50 L 290,0" />   {/* Branch T-1 */}
              <path className="circuit-line-static" d="M 400,240 L 460,180 L 460,50 L 510,0" />   {/* Branch T-2 */}

              {/* Vertical Bottom Axial Lines */}
              <path className="circuit-line-static" d="M 400,440 L 400,600 L 450,650 L 450,800" />
              <path className="circuit-line-static" d="M 395,440 L 395,598 L 445,648 L 445,800" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 400,540 L 340,600 L 340,750 L 290,800" />   {/* Branch B-1 */}
              <path className="circuit-line-static" d="M 400,560 L 460,620 L 460,750 L 510,800" />   {/* Branch B-2 */}

              {/* Horizontal Left Axial Lines */}
              <path className="circuit-line-static" d="M 360,400 L 200,400 L 150,450 L 0,450" />
              <path className="circuit-line-static" d="M 360,395 L 202,395 L 152,445 L 0,445" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 260,400 L 200,340 L 100,340 L 0,240" />   {/* Branch L-1 */}
              <path className="circuit-line-static" d="M 240,400 L 200,460 L 100,460 L 0,560" />   {/* Branch L-2 */}

              {/* Horizontal Right Axial Lines */}
              <path className="circuit-line-static" d="M 440,400 L 600,400 L 650,350 L 800,350" />
              <path className="circuit-line-static" d="M 440,405 L 598,405 L 648,355 L 800,355" /> {/* Parallel bus */}
              <path className="circuit-line-static" d="M 540,400 L 600,340 L 700,340 L 800,240" />   {/* Branch R-1 */}
              <path className="circuit-line-static" d="M 560,400 L 600,460 L 700,460 L 800,560" />   {/* Branch R-2 */}


              {/* Glowing Active Current Flow Paths (Running Continuous Lines) */}
              <path className="circuit-line-flow" d="M 380,380 L 260,260 L 120,260 L 0,140" />
              <path className="circuit-line-flow" d="M 300,300 L 200,300 L 100,300 L 0,200" />
              <path className="circuit-line-flow" d="M 420,380 L 540,260 L 680,260 L 800,140" />
              <path className="circuit-line-flow" d="M 520,280 L 520,180 L 620,80 L 800,80" />
              <path className="circuit-line-flow" d="M 420,420 L 540,540 L 680,540 L 800,660" />
              <path className="circuit-line-flow" d="M 500,500 L 600,500 L 700,500 L 800,600" />
              <path className="circuit-line-flow" d="M 380,420 L 260,540 L 120,540 L 0,660" />
              <path className="circuit-line-flow" d="M 280,520 L 280,620 L 180,720 L 0,720" />
              <path className="circuit-line-flow" d="M 400,360 L 400,200 L 350,150 L 350,0" />
              <path className="circuit-line-flow" d="M 400,240 L 460,180 L 460,50 L 510,0" />
              <path className="circuit-line-flow" d="M 400,440 L 400,600 L 450,650 L 450,800" />
              <path className="circuit-line-flow" d="M 400,540 L 340,600 L 340,750 L 290,800" />
              <path className="circuit-line-flow" d="M 360,400 L 200,400 L 150,450 L 0,450" />
              <path className="circuit-line-flow" d="M 240,400 L 200,460 L 100,460 L 0,560" />
              <path className="circuit-line-flow" d="M 440,400 L 600,400 L 650,350 L 800,350" />
              <path className="circuit-line-flow" d="M 540,400 L 600,340 L 700,340 L 800,240" />


              {/* Decorative Micro PCB elements / square grids */}
              <rect className="circuit-symbol" x="100" y="150" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="112" y="150" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="100" y="162" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="112" y="162" width="6" height="6" rx="1" />

              <rect className="circuit-symbol" x="680" y="150" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="692" y="150" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="680" y="162" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="692" y="162" width="6" height="6" rx="1" />

              <rect className="circuit-symbol" x="100" y="630" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="112" y="630" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="100" y="642" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="112" y="642" width="6" height="6" rx="1" />

              <rect className="circuit-symbol" x="680" y="630" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="692" y="630" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="680" y="642" width="6" height="6" rx="1" />
              <rect className="circuit-symbol" x="692" y="642" width="6" height="6" rx="1" />


              {/* Glowing Junction Split Node Pads (Internal Joint Pads) */}
              <g transform="translate(300, 300)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(280, 280)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(500, 300)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(520, 280)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(500, 500)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(520, 520)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(300, 500)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(280, 520)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(400, 260)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(400, 540)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(260, 400)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
              <g transform="translate(540, 400)">
                <circle className="circuit-node-pulse" cx="0" cy="0" r="5" />
                <circle className="circuit-node" cx="0" cy="0" r="3" />
              </g>
            </svg>
          </div>

          {/* HUD FOOTER DETAILS */}
          {/* <div className="login-footer-info">
            <span className="login-footer-text">SECURE SESSION // RSA-4096 LAYER // EXP-V56</span>
          </div> */}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
