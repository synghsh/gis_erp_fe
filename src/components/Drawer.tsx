import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Components.css';

export interface DrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  closeOnOverlayClick?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '460px',
  closeOnOverlayClick = true,
}) => {
  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (closeOnOverlayClick && onClose) {
      onClose();
    }
  };

  const drawerNode = (
    <AnimatePresence>
      {isOpen && (
        <div className="drawer-root">
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
          />

          {/* Drawer Content Container */}
          <motion.div
            className="drawer-content"
            style={{ maxWidth }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          >
            {/* Header */}
            <div className="drawer-header">
              <h3 className="drawer-title">{title}</h3>
              {onClose && (
                <button type="button" className="drawer-close-btn" onClick={onClose}>
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="drawer-body">{children}</div>

            {/* Footer */}
            {footer && <div className="drawer-footer">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerNode, document.body);
};

export default Drawer;
