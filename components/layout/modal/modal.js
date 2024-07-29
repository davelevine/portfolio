import React, { lazy, Suspense, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import classes from './modal.module.scss';

const ContactModalDynamic = lazy(() => import('./contactModal'));

const RESUME_FILE_PATH = 'https://cdn.levine.io/uploads/portfolio/public/assets/davelevine-resume.pdf';

const Modal = ({ contact, resume, onClose, ...props }) => {
  const fadeIn = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0 },
  }), []);

  const renderContactModal = useCallback(() => (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
      <Suspense fallback={
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={classes.spinner}
        />
      }>
        <ContactModalDynamic {...props} onClose={onClose} />
      </Suspense>
    </motion.div>
  ), [onClose, props, fadeIn]);

  const renderResumeModal = useCallback(() => (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
      <div className={classes.resumeModal}>
        <button className={classes.close} onClick={onClose} aria-label="Close">
          <i className='fa fa-xmark'></i>
        </button>
        <iframe src={RESUME_FILE_PATH} className={classes.iframe} title="Resume" />
      </div>
    </motion.div>
  ), [onClose, fadeIn]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classes.backdrop}
      onClick={handleBackdropClick}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={classes.modalContent}
        variants={fadeIn}
      >
        {contact && renderContactModal()}
        {resume && renderResumeModal()}
      </motion.div>
    </motion.div>
  );
};

export default Modal;