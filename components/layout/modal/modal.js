import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import classes from './modal.module.scss';

// Lazy load the ContactModal component
const ContactModalDynamic = lazy(() => import('./contactModal'));

// Constants
const RESUME_FILE_PATH = '/assets/davelevine-resume.pdf'; // Path to the resume file

const Modal = ({ contact, resume, onClose, ...props }) => {
  // Define animation variants for the modal
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0 },
  };

  // Function to render the contact modal
  const renderContactModal = useCallback(() => (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
      <Suspense fallback={<p>Loading...</p>}>
        <ContactModalDynamic {...props} onClose={onClose} />
      </Suspense>
    </motion.div>
  ), [onClose, props]);

  // Function to render the resume modal
  const renderResumeModal = useCallback(() => (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
      <div className={classes.resumeModal}>
        <a href='#!' className={classes.close} onClick={onClose}>
          <i className='fa fa-xmark'></i>
        </a>
        <iframe src={RESUME_FILE_PATH} className={classes.iframe} title="Resume" />
      </div>
    </motion.div>
  ), [onClose]);

  // Handle click on the backdrop to close the modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Effect to handle the Escape key press to close the modal
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
      onClick={handleBackdropClick} // Handle backdrop click
    >
      <motion.div
        onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
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
