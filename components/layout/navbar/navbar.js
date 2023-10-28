// Import required modules and components
import classes from './navbar.module.scss';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useCycle } from 'framer-motion';
import Modal from '../../layout/modal/modal';
import ThemeToggle from './themeToggle';
import MenuToggle from './menuToggle';
import { useRouter } from 'next/router'; // Import useRouter from Next.js

// Define the Navbar component
const Navbar = (props) => {
  const { theme } = props;

  // State variables
  const [sticky, setSticky] = useState(false); // For sticky navbar effect
  const [showModal, setShowModal] = useState(); // For controlling modal visibility

  const [isOpen, toggleOpen] = useCycle(false, true); // For mobile menu toggle
  const router = useRouter(); // Get the current route

  // Toggle between light and dark themes
  function setThemeHandler() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    props.newTheme(newTheme); // Call a function to change the theme
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
    if (window.pageYOffset >= 100) {
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
    window.onscroll = fixNavbar;
  }, []);

  // Function to check if a link is active
  function isLinkActive(href) {
    // Check if the current route matches the link's href
    return router.pathname === href;
  }

  // Render the Navbar component
  return (
    <>
      <div
        className={
          sticky ? `${classes.navbar}  ${classes.sticky}` : `${classes.navbar}`
        }>
        <div className={classes.container}>
          <Link href='/'>
            <a className={classes.logo}>
              <span className={classes.name}>&lt;</span>
              /DAVE LEVINE
              <span className={classes.name}>&gt;</span>
            </a>
          </Link>

          <nav
            className={
              isOpen
                ? `${classes.navMenu} ${classes.responsive}`
                : `${classes.navMenu}`
            }
            id='navMenu'>
            <div className={classes.linkWrapper}>
              {/* Links to different sections with animations */}
              <Link href='/'>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={toggleNav}
                  className={isLinkActive('/') ? classes.activeLink : ''} // Check if Home link is active
                >
                  HOME
                </motion.a>
              </Link>

              <Link href='/projects'>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={toggleNav}
                  className={isLinkActive('/projects') ? classes.activeLink : ''} // Check if Projects link is active
                >
                  PROJECTS
                </motion.a>
              </Link>

              <Link href='/posts'>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={toggleNav}
                  className={isLinkActive('/posts') ? classes.activeLink : ''} // Check if Blog link is active
                >
                  CERTS
                </motion.a>
              </Link>

              <Link href='/#about'>
                <motion.a
                  style={{ cursor: 'pointer' }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  onClick={toggleNav}
                  className={isLinkActive('/#about') ? classes.activeLink : ''} // Check if About me link is active
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
              onClick={() => {
                toggleModal();
              }}>
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
              onClick={() => {
                setThemeHandler();
              }}>
              <ThemeToggle theme={theme} />
            </motion.button>

            {/* Button to toggle the mobile menu */}
            <motion.div
              className={classes.iconMain}
              initial={false}
              animate={isOpen ? 'open' : 'closed'}>
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
