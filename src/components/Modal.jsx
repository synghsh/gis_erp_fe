import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Components.css';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '550px',
  closeOnOverlayClick = true,
}) => {
  // Prevent background scroll when modal is open
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

  const modalNode = (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-root">
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
          />

          {/* Modal Container */}
          <div className="modal-container-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div
              className="modal-content"
              style={{ maxWidth, pointerEvents: 'auto' }}
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Header */}
              <div className="modal-header">
                <h3 className="modal-title">{title}</h3>
                {onClose && (
                  <button type="button" className="modal-close-btn" onClick={onClose}>
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="modal-body">{children}</div>

              {/* Footer */}
              {footer && <div className="modal-footer">{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalNode, document.body);
};

export default Modal;
