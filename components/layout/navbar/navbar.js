// Import required modules and components
import classes from './navbar.module.scss';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useCycle } from 'framer-motion';
import Modal from '../../layout/modal/modal';
import ThemeToggle from './themeToggle';
import MenuToggle from './menuToggle';
import { useRouter } from 'next/router';

// Define the Navbar component
const Navbar = (props) => {
  const { theme } = props;
  const [sticky, setSticky] = useState(false);
  const [showModal, setShowModal] = useState();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const router = useRouter();

  // Toggle between light and dark themes
  function setThemeHandler() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    props.newTheme(newTheme);
  }

  // Toggle the visibility of the modal
  function toggleModal() {
    setShowModal(!showModal);
  }

  // Toggle the mobile navigation menu
  function toggleNav() {
    toggleOpen();
  }

  // Function to apply a sticky effect to the navbar
  function fixNavbar() {
    if (window.scrollY >= 100) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }

  // Effect to control body overflow when the modal is shown or hidden
  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    if (!showModal) document.body.style.overflow = 'unset';
  }, [showModal]);

  // Effect to apply the sticky navbar on scroll
  useEffect(() => {
    const debounceFixNavbar = debounce(fixNavbar, 100);
    window.addEventListener('scroll', debounceFixNavbar);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', debounceFixNavbar);
    };
  }, []);

  // Function to check if a link is active
  function isLinkActive(href) {
    // Check if the current route matches the link's href
    return router.pathname === href;
  }

  // Debounce function for better performance
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  // Render the Navbar component
  return (
    <>
      <div
        className={
          sticky
            ? `${classes.navbar}  ${classes.sticky}`
            : `${classes.navbar}`
        }
      >
        <div className={classes.container}>
          <Link href='/' passHref legacyBehavior>
            <a className={classes.logo}>
              <span className={classes.name}>&lt;</span>/DAVE LEVINE
              <span className={classes.name}>&gt;</span>
            </a>
          </Link>

          <nav
            className={
              isOpen
                ? `${classes.navMenu} ${classes.responsive}`
                : `${classes.navMenu}`
            }
            id='navMenu'
          >
            <div className={classes.linkWrapper}>
              <Link href='/' passHref legacyBehavior>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={toggleNav}
                  className={
                    isLinkActive('/') ? classes.activeLink : ''
                  }
                >
                  HOME
                </motion.a>
              </Link>

              <Link href='/projects' passHref legacyBehavior>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={toggleNav}
                  className={
                    isLinkActive('/projects') ? classes.activeLink : ''
                  }
                >
                  PROJECTS
                </motion.a>
              </Link>

              <Link href='/certs' passHref legacyBehavior>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={toggleNav}
                  className={
                    isLinkActive('/certs') ? classes.activeLink : ''
                  }
                >
                  CERTS
                </motion.a>
              </Link>

              <Link href='/about' passHref legacyBehavior>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  onClick={toggleNav}
                  className={
                    isLinkActive('/about') ? classes.activeLink : ''
                  }
                >
                  ABOUT
                </motion.a>
              </Link>
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
              {showModal ? (
                <i className='fa fa-envelope-open'></i>
              ) : (
                <i className='fa fa-envelope'></i>
              )}
            </motion.button>

            {/* Button to toggle between light and dark themes */}
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
      <main>{props.children}</main>
    </>
  );
};

// Export the Navbar component
export default Navbar;
