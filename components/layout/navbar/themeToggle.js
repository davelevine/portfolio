import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

/**
 * ThemeToggle component to switch between light and dark mode icons with animations.
 * @param {Object} props - Component properties.
 * @param {string} props.theme - Current theme, either 'light' or 'dark'.
 * @returns {JSX.Element} The rendered component.
 */
const ThemeToggle = ({ theme }) => {
  // Determine the icon class and key based on the current theme
  const iconClass = theme === 'light' ? 'fa-sun' : 'fa-moon';
  const iconKey = theme === 'light' ? 'sun' : 'moon';

  // Memoize motion properties for the icon to avoid unnecessary recalculations
  const motionProps = useMemo(() => ({
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
    transition: { ease: 'easeOut', duration: 0.4 },
  }), []);

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
