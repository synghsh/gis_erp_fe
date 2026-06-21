import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleTheme } from '../../store/slices/themeSlice';
import './Layout.css';

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  return (
    <button
      type="button"
      className="header-action-btn theme-toggle-container"
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle Theme Mode"
    >
      <motion.div
        key={themeMode}
        initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {themeMode === 'light' ? (
          <Moon size={20} />
        ) : (
          <Sun size={20} style={{ color: '#fbbf24' }} />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
