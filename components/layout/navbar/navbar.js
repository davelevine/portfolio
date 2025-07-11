import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useCycle } from 'framer-motion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import classes from './navbar.module.scss';
import ThemeToggle from './themeToggle';
import MenuToggle from './menuToggle';

// Dynamically import the Modal component for code splitting
const Modal = dynamic(() => import('../../layout/modal/modal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

// Create a motion-enabled Link component
const MotionLink = motion(Link);

// Debounce function to limit the rate at which a function can fire
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Custom hook to manage sticky navbar state
const useStickyNavbar = () => {
  const [sticky, setSticky] = useState(false);

  const fixNavbar = useCallback(() => {
    setSticky(window.scrollY >= 100);
  }, []);

  useEffect(() => {
    const debounceFixNavbar = debounce(fixNavbar, 100);
    window.addEventListener('scroll', debounceFixNavbar);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', debounceFixNavbar);
    };
  }, [fixNavbar]);

  return sticky;
};

// Navbar component
const Navbar = ({ theme, newTheme, children }) => {
  const [showModal, setShowModal] = useState(false);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const router = useRouter();
  const sticky = useStickyNavbar();

  // Toggle between light and dark themes
  const setThemeHandler = useCallback(() => {
    newTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, newTheme]);

  // Toggle the visibility of the modal
  const toggleModal = useCallback(() => {
    setShowModal(prev => !prev);
  }, []);

  // Toggle the mobile navigation menu
  const toggleNav = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);

  // Close mobile menu on navigation
  const handleNavClick = useCallback(() => {
    if (window.innerWidth <= 768 && isOpen) {
      toggleOpen();
    }
  }, [isOpen, toggleOpen]);

  // Effect to control body overflow when the modal is shown or hidden
  useEffect(() => {
    document.body.classList.toggle('modal-open', showModal);
  }, [showModal]);

  // Function to check if a link is active
  const isLinkActive = useCallback((href) => router.pathname === href, [router.pathname]);

  return (
    <>
      <motion.div
        className={sticky ? `${classes.navbar} ${classes.sticky}` : classes.navbar}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={classes.container}>
          <Link href='/' className={classes.logo}>
            <span className={classes.name}>&lt;</span>/DAVE LEVINE
            <span className={classes.name}>&gt;</span>
          </Link>

          <nav className={isOpen ? `${classes.navMenu} ${classes.responsive}` : classes.navMenu} id='navMenu'>
            <div className={classes.linkWrapper}>
              {['/', '/projects', '/certs', '/blog', '/now', '/about'].map((path, index) => (
                <MotionLink
                  key={path}
                  href={path}
                  onClick={handleNavClick}
                  className={isLinkActive(path) ? classes.activeLink : ''}
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 + index * 0.075 }}
                >
                  {path === '/about' ? 'ABOUT ME' : path.toUpperCase().replace('/', '') || 'HOME'}
                </MotionLink>
              ))}
            </div>
          </nav>

          <div className={classes.navContainer}>
            {/* Button to toggle the contact modal */}
            <motion.button
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className={classes.icon}
              onClick={toggleModal}
              aria-label='Toggle Contact Modal'
            >
              <i className={`fa ${showModal ? 'fa-envelope-open' : 'fa-envelope'}`}></i>
            </motion.button>

            {/* Container with fixed width for ThemeToggle */}
            <div className={classes.themeToggleContainer}>
              <motion.button
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className={classes.icon}
                onClick={setThemeHandler}
                aria-label='Toggle Theme'
              >
                <ThemeToggle theme={theme} />
              </motion.button>
            </div>

            {/* Button to toggle the mobile menu */}
            <motion.div
              className={classes.iconMain}
              initial={false}
              animate={isOpen ? 'open' : 'closed'}
              aria-label='Toggle Mobile Menu'
            >
              <MenuToggle toggleNav={toggleNav} />
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* Modal for contact information */}
      <AnimatePresence>
        {showModal && <Modal contact onClose={toggleModal} />}
      </AnimatePresence>
      <main>{children}</main>
    </>
  );
};

export default Navbar;
