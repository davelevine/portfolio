import classes from './hero.module.scss';
import Image from 'next/legacy/image';
import { useState, useEffect, useCallback } from 'react';
import Modal from '../layout/modal/modal';
import Aos from 'aos'; // Library for scroll animations
import 'aos/dist/aos.css'; // Styles for AOS animations
import { motion, AnimatePresence } from 'framer-motion';

// Constants
const RESUME_FILE_PATH = '/assets/davelevine-resume.pdf';
const MOBILE_PROFILE_IMAGE_PATH = '/images/profile-pic-1-mobile.webp';
const DESKTOP_PROFILE_IMAGE_PATH = '/images/profile-pic-1-desktop.webp';
const PGP_KEY_PATH = '/assets/dave.levine.io-pgp-key-pub.asc'; // Path to the PGP key

const Hero = () => {
  // State for controlling the modal visibility
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // State to determine modal type (contact or resume)
  const [isMobile, setIsMobile] = useState(false); // State to determine mobile/desktop

  // Refactored button handlers into a single function
  const handleButtonClick = useCallback((path) => {
    window.location.href = path;
  }, []);

  // Function to open the modal
  const showModalHandler = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  // Function to close the modal
  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  // Effects for managing body overflow when the modal is open or closed
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

  // Initialize the AOS library with specified settings
  useEffect(() => {
    Aos.init({ duration: 550 }); // Adjusted scroll animations speed to match about.js
  }, []);

  // Detect if it's a mobile device on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateIsMobile = () => {
        setIsMobile(window.innerWidth <= 767);
      };

      // Initial check
      updateIsMobile();

      // Update the state when the window is resized
      window.addEventListener('resize', updateIsMobile);

      // Cleanup the event listener
      return () => {
        window.removeEventListener('resize', updateIsMobile);
      };
    }
  }, []);

  const handleImageError = () => {
    setIsMobile(!isMobile);
  };

  const buttonVariants = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  };

  return (
    <section className={classes.greetings}>
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.columnLeft}>
            {/* Introduction section with data-aos animation attributes */}
            <h2 data-aos='fade-left'>Hey, I&apos;m{' '}
              <span className={classes.name}>
                Dave
              </span>!{' '}
            </h2>
            <h1 data-aos='fade-right'>Solutions Engineer</h1>
            <h3 data-aos='fade-left' data-aos-delay='200'>
              I design and implement systems
              <span className={classes.punctuation}><b>.</b></span>
              <span>
              </span>{' '}
            </h3>
            <div className={classes.socialMedia}>
              {/* Links to social media profiles with data-aos animations */}
              <a href='https://github.com/davelevine' target='_blank' rel='noreferrer' aria-label="GitHub Profile">
                <i className='fab fa-github' data-aos='flip-up'></i>
              </a>
              <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer' aria-label="LinkedIn Profile">
                <i
                  className='fab fa-linkedin'
                  data-aos='flip-up'
                  data-aos-delay='100'></i>
              </a>{' '}
              <a href='https://kb.levine.io' target='_blank' rel='noreferrer' aria-label="Knowledge Base">
                <i
                  className='fas fa-globe'
                  data-aos='flip-up'
                  data-aos-delay='200'></i>
              </a>
              <a href={PGP_KEY_PATH} target='_blank' rel='noreferrer' aria-label="PGP Key">
                <i
                  className='fa fa-key'
                  data-aos='flip-up'
                  data-aos-delay='300'></i>
              </a>
            </div>
            <div className={classes.ctaButtons}>
              {/* Call-to-action buttons with framer-motion animations */}
              <motion.button
                variants={buttonVariants}
                className='btn btn-filled'
                data-aos='fade-up'
                onClick={() => showModalHandler('resume')}
                aria-label="My Resume"
                transition={{ duration: 0.55 }} // Adjusted transition speed to match about.js
              >
                MY RESUME
              </motion.button>
              <motion.button
                variants={buttonVariants}
                className='btn btn-outlined'
                data-aos='fade-down'
                onClick={() => showModalHandler('contact')}
                aria-label="Contact Me"
                transition={{ duration: 0.55 }} // Adjusted transition speed to match about.js
              >
                CONTACT
              </motion.button>
            </div>
          </div>

          <div className={`${classes.columnRight} ${classes.profilePic}`}>
            {/* Conditionally render different images based on viewport width */}
            {isMobile ? (
              <Image
                src={MOBILE_PROFILE_IMAGE_PATH}
                width={230}
                height={230}
                alt="profile-pic"
                data-aos="fade-left"
                className="zoomed-out-image"
                loading="eager"
                onError={handleImageError}
              />
            ) : (
              <Image
                src={DESKTOP_PROFILE_IMAGE_PATH}
                width={460}
                height={460}
                alt="profile-pic"
                data-aos="fade-left"
                className="zoomed-out-image"
                loading="eager"
                onError={handleImageError}
              />
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {/* Display the modal when showModal is true */}
        {showModal && <Modal contact={modalType === 'contact'} resume={modalType === 'resume'} onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

// Export the Hero component
export default Hero;