import { motion } from 'framer-motion';
import classes from './navbar.module.scss';

// Path component for the SVG paths with motion properties
const Path = (props) => (
  <motion.path
    fill='transparent'
    strokeWidth='3'
    stroke='hsl(0, 0%, 18%)'
    strokeLinecap='round'
    {...props}
  />
);

// MenuToggle component for the mobile menu button
const MenuToggle = ({ toggleNav }) => (
  <motion.button
    className={`${classes.icon} ${classes.iconMain}`}
    onClick={toggleNav}
    aria-label="Toggle Mobile Menu"
    initial={{ opacity: 0, y: -100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
  >
    <svg width='45' height='45' viewBox='0 0 23 23'>
      {/* Top Path */}
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      {/* Middle Path */}
      <Path
        d='M 2 9.423 L 20 9.423'
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      {/* Bottom Path */}
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </motion.button>
);

export default MenuToggle;
