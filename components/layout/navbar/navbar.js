import classes from './navbar.module.scss';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useCycle } from 'framer-motion';
import Modal from '../../layout/modal/modal';
import ThemeToggle from './themeToggle';
import MenuToggle from './menuToggle';
import { useRouter } from 'next/router';

// Define the Navbar component
const Navbar = ({ theme, newTheme, children }) => {
  const [sticky, setSticky] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const router = useRouter();

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

  // Function to apply a sticky effect to the navbar
  const fixNavbar = useCallback(() => {
    setSticky(window.scrollY >= 100);
  }, []);

  // Debounce function for better performance
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Effect to control body overflow and padding when the modal is shown or hidden
  useEffect(() => {
    const calculateScrollbarWidth = () => {
      const scrollDiv = document.createElement('div');
      scrollDiv.style.width = '100px';
      scrollDiv.style.height = '100px';
      scrollDiv.style.overflow = 'scroll';
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    };

    const scrollbarWidth = calculateScrollbarWidth();

    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
  }, [showModal]);

  // Effect to apply the sticky navbar on scroll
  useEffect(() => {
    const debounceFixNavbar = debounce(fixNavbar, 100);
    window.addEventListener('scroll', debounceFixNavbar);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', debounceFixNavbar);
    };
  }, [debounce, fixNavbar]);

  // Function to check if a link is active
  const isLinkActive = useCallback((href) => {
    return router.pathname === href;
  }, [router.pathname]);

  // Render the Navbar component
  return (
    <>
      <div className={sticky ? `${classes.navbar} ${classes.sticky}` : classes.navbar}>
        <div className={classes.container}>
          <Link href='/' passHref legacyBehavior>
            <a className={classes.logo}>
              <span className={classes.name}>&lt;</span>/DAVE LEVINE
              <span className={classes.name}>&gt;</span>
            </a>
          </Link>

          <nav className={isOpen ? `${classes.navMenu} ${classes.responsive}` : classes.navMenu} id='navMenu'>
            <div className={classes.linkWrapper}>
              {['/', '/projects', '/certs', '/about'].map((path, index) => (
                <Link href={path} passHref legacyBehavior key={path}>
                  <motion.a
                    style={{ cursor: 'pointer' }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 + index * 0.1 }}
                    onClick={toggleNav}
                    className={isLinkActive(path) ? classes.activeLink : ''}
                  >
                    {path.toUpperCase().replace('/', '') || 'HOME'}
                  </motion.a>
                </Link>
              ))}
            </div>
          </nav>

          <div className={classes.navContainer}>
            {/* Button to toggle the contact modal */}
            <motion.button
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.icon}
              onClick={toggleModal}
              aria-label='Toggle Contact Modal'
            >
              <i className={`fa ${showModal ? 'fa-envelope-open' : 'fa-envelope'}`}></i>
            </motion.button>

            {/* Container with fixed width for ThemeToggle */}
            <div className={classes.themeToggleContainer}>
              <motion.button
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
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
      </div>
      {/* Modal for contact information */}
      <AnimatePresence>
        {showModal && <Modal contact onClose={toggleModal} />}
      </AnimatePresence>
      <main>{children}</main>
    </>
  );
};

// Export the Navbar component
export default Navbar;
