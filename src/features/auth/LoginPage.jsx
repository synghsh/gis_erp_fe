import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure, setRememberMe, clearError } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/globalSlice';
import TextInput from '../../components/form/TextInput';
import PasswordInput from '../../components/form/PasswordInput';
import Button from '../../components/Button';
import FormWrapper from '../../components/form/FormWrapper';
import ThemeToggle from '../../components/layout/ThemeToggle';
import './Auth.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, rememberMe } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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

  const onSubmit = async (data) => {
    dispatch(loginStart());

    // Simulate mock network response delay
    setTimeout(() => {
      // Validate credentials (accepts anything for mock demo, or specific credentials)
      const validEmail = data.email.trim();
      
      if (data.password.length < 6) {
        dispatch(loginFailure('Password must be at least 6 characters.'));
        return;
      }

      // Successful Auth mock payload
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
    }, 1200);
  };

  return (
    <div className="login-page-container">
      {/* Dynamic Background */}
      <div className="login-bg-glows">
        <div className="bg-glow-ball glow-ball-1" />
        <div className="bg-glow-ball glow-ball-2" />
        <div className="bg-glow-ball glow-ball-3" />
      </div>

      {/* Floating Theme Toggle */}
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      {/* Card Form container */}
      <motion.div
        className="login-card glass-panel"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        <div className="login-header">
          <div className="login-logo">
            <Globe size={24} />
          </div>
          <h2 className="login-title">Welcome to GIS ERP</h2>
          <p className="login-subtitle">Sign in to manage geospatial enterprise portals</p>
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
            size="lg"
          >
            Sign In
          </Button>
        </FormWrapper>
      </motion.div>
    </div>
  );
};

export default LoginPage;
