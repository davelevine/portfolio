// modal.js
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import classes from './modal.module.scss';

// Lazy load the ContactModal component
const ContactModalDynamic = lazy(() => import('./contactModal'));

const Modal = ({ contact, resume, onClose, ...props }) => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, type: 'easeInOut' } },
    exit: { opacity: 0 },
  };

  const isMobile = () => window.innerWidth <= 767;

  const renderContactModal = () => (
    <Suspense fallback={<p>Loading...</p>}>
      <ContactModalDynamic {...props} onClose={onClose} />
    </Suspense>
  );

  const renderResumeModal = () => {
    if (isMobile()) {
      window.location.href = '/assets/davelevine-resume.pdf';
      return null;
    }
    return (
      <div className={classes.resumeModal}>
        <a href='#!' className={classes.close} onClick={onClose}>
          <i className='fa fa-xmark'></i>
        </a>
        <iframe src='/assets/davelevine-resume.pdf' className={classes.iframe} />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classes.backdrop}
      onClick={onClose} // Close modal when clicking the backdrop
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
