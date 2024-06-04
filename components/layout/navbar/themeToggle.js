import { motion, AnimatePresence } from 'framer-motion';

// Refactored ThemeToggle component to improve readability and maintainability
const ThemeToggle = ({ theme }) => {
  // Determine the icon class and key based on the theme
  const iconClass = theme === 'light' ? 'fa-moon' : 'fa-sun';
  const iconKey = theme === 'light' ? 'moon' : 'sun';

  // Define motion properties for the icon
  const motionProps = {
    initial: { x: -25, y: 5, opacity: 1 },
    animate: { x: 0, y: 0, opacity: 1 },
    exit: { x: 25, y: 5, opacity: 0 },
    transition: { ease: 'easeOut', duration: 0.4 },
  };

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.i
        className={`fa ${iconClass}`}
        key={iconKey}
        {...motionProps}
      />
    </AnimatePresence>
  );
};

export default ThemeToggle;

