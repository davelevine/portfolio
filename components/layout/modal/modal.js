// modal.js
import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import classes from './modal.module.scss';

// Lazy load the ContactModal component
const ContactModalDynamic = lazy(() => import('./contactModal'));

const Modal = ({ contact, resume, onClose, ...props }) => {
  // Define animation variants for the modal
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, type: 'easeInOut' } },
    exit: { opacity: 0 },
  };

  // Function to render the contact modal
  const renderContactModal = () => (
    <Suspense fallback={<p>Loading...</p>}>
      <ContactModalDynamic {...props} onClose={onClose} />
    </Suspense>
  );

  // Function to render the resume modal
  const renderResumeModal = () => (
    <div className={classes.resumeModal}>
      <a href='#!' className={classes.close} onClick={onClose}>
        <i className='fa fa-xmark'></i>
      </a>
      <iframe src='/assets/davelevine-resume.pdf' className={classes.iframe} />
    </div>
  );

  // Handle click on the backdrop to close the modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {contact && renderContactModal()}
        {resume && renderResumeModal()}
      </motion.div>
    </motion.div>
  );
};

export default Modal;