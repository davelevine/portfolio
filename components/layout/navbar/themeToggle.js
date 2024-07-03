import { motion, AnimatePresence } from 'framer-motion';

// Refactored ThemeToggle component to improve readability and maintainability
const ThemeToggle = ({ theme }) => {
  // Determine the icon class and key based on the theme
  const iconClass = theme === 'light' ? 'fa-sun' : 'fa-moon';
  const iconKey = theme === 'light' ? 'sun' : 'moon';

  // Define motion properties for the icon
  const motionProps = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
    transition: { ease: 'easeOut', duration: 0.4 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.i
        className={`fa ${iconClass}`}
        key={iconKey}
        {...motionProps}
      />
    </AnimatePresence>
  );
};

export default ThemeToggle;
