import classes from './hero.module.scss';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Modal from '../layout/modal/modal';
import Aos from 'aos'; // Library for scroll animations
import 'aos/dist/aos.css'; // Styles for AOS animations
import { motion, AnimatePresence } from 'framer-motion';

// Define the Hero component
const Hero = () => {
  // State for controlling the modal visibility
  const [showModal, setShowModal] = useState();

  // Function to handle button click for redirecting to a resume file
  function buttonHandler() {
    window.location.href = '/assets/davelevine-resume.pdf';
  }

  // Function to open the modal
  function showModalHandler() {
    setShowModal(true);
  }

  // Function to close the modal
  function closeModalHandler() {
    setShowModal(false);
  }

  // Effects for managing body overflow when the modal is open or closed
  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    if (!showModal) document.body.style.overflow = 'unset';
  }, [showModal]);

  // Initialize the AOS library with specified settings
  useEffect(() => {
    Aos.init({ duration: 500 }); // Initialize scroll animations
  }, []);

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
            <h4 data-aos='fade-left' data-aos-delay='150'>
              I design and implement systems
              <span className={classes.punctuation}><b>.</b></span>
              <span>
              </span>{' '}
            </h4>
            <div className={classes.socialMedia}>
              {/* Links to social media profiles with data-aos animations */}
              <a href='https://github.com/davelevine' target='_blank' rel='noreferrer' aria-label="GitHub Profile">
                <i className='fab fa-github' data-aos='flip-up'></i>
              </a>
              <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer' aria-label="LinkedIn Profile">
                <i
                  className='fab fa-linkedin'
                  data-aos='flip-up'
                  data-aos-delay='50'></i>
              </a>{' '}
              <a href='https://kb.levine.org' target='_blank' rel='noreferrer' aria-label="Knowledge Base">
                <i
                  className='fas fa-globe'
                  data-aos='flip-up'
                  data-aos-delay='150'></i>
              </a>
            </div>
            <div className={classes.ctaButtons}>
              {/* Call-to-action buttons with framer-motion animations */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='btn btn-filled'
                data-aos='fade-up'
                onClick={buttonHandler}
                aria-label="My Resume" // Accessible name for the button
              >
                MY RESUME
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='btn btn-outlined'
                data-aos='fade-down'
                onClick={showModalHandler}
                aria-label="Contact Me" // Accessible name for the button
              >
                CONTACT
              </motion.button>
            </div>
          </div>

          <div className={`${classes.columnRight} ${classes.profilePic}`}>
            {/* Display the profile picture using Next.js Image component with preload */}
            <Image
              src='/images/profile-pic-1.webp'
              width={460}
              height={460}
              alt='profile-pic'
              data-aos='fade-left'
              className='zoomed-out-image'
              loading='eager' // Set loading attribute to 'eager' to indicate preload
            />
          </div>
        </div>
        <div className='iconScrollContainer'>
          <a href='#about' aria-label="Jump to About Section">
            {/* Scroll-to section link with data-aos animation */}
            <div
              className='iconScroll'
              data-aos='fade-down'
              data-aos-offset='50'></div>
          </a>
        </div>
      </div>
      <AnimatePresence>
        {/* Display the modal when showModal is true */}
        {showModal && <Modal contact onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

// Export the Hero component
export default Hero;
