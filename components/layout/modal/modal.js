// modal.js

import classes from './modal.module.scss';
import { motion } from 'framer-motion';
import React, { lazy, Suspense } from 'react';

// Refactored animation settings into a separate function for reusability and clarity
const getDropInAnimation = () => ({
  hidden: {
    y: '-100vh',
  },
  visible: {
    y: '50vh',
    transition: {
      duration: 0.3, // Increased duration to slow down the animation
      type: 'circInOut', // Changed to 'circInOut' to ensure smoother and slower animation
    },
  },
  exit: {
    y: '150vh',
  },
});

// Lazy load the ContactModal component
const ContactModalDynamic = lazy(() => import('./contactModal'));

const Modal = ({ contact, onClose, ...props }) => {
  // Destructured props for better readability
  const dropIn = getDropInAnimation();

  return (
    <>
      {contact && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={classes.backdrop}
          onClick={onClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial='hidden'
            animate='visible'
            exit='exit'>
            <Suspense fallback={<p>Loading...</p>}>
              {/* Use the dynamically loaded ContactModal component */}
              <ContactModalDynamic {...props} />
            </Suspense>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Modal;
