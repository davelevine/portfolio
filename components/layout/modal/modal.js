// modal.js

import classes from './modal.module.scss';
import { motion } from 'framer-motion';
import React, { lazy, Suspense } from 'react';

// Refactored animation settings into a separate function for reusability and clarity
const getFadeInAnimation = () => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3, // Duration for the fade-in animation
      type: 'easeInOut', // Smooth easing for the fade-in animation
    },
  },
  exit: {
    opacity: 0,
  },
});

// Lazy load the ContactModal component
const ContactModalDynamic = lazy(() => import('./contactModal'));

const Modal = ({ contact, onClose, ...props }) => {
  // Destructured props for better readability
  const fadeIn = getFadeInAnimation();

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
            variants={fadeIn}
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

