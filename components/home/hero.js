import classes from './hero.module.scss';
import Image from "next/image";
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic'; // Dynamically import Modal
import Aos from 'aos'; // Library for scroll animations
import 'aos/dist/aos.css'; // Styles for AOS animations
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import Footer from '../layout/footer'; // Import Footer

// Dynamically import Modal to reduce initial load
const Modal = dynamic(() => import('../layout/modal/modal'), {
  loading: () => <p>Loading...</p>, // Add a loading component
});

// Constants for image paths and PGP key path
const PGP_KEY_PATH = '/assets/dave.levine.io-pgp-key-pub.asc'; // Path to the PGP key
const PROFILE_PIC_PATH = '/images/profile-pic-1.webp'; // Path to the profile picture
const PROFILE_PIC_BLUR_DATA_URL = '/images/profile-pic-1-low-res.webp'; // Base64-encoded Data URL for a small blurred version of the profile picture

const Hero = () => {
  // State for controlling the modal visibility
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // State to determine modal type (contact or resume)

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
    const hideScrollbar = () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };

    hideScrollbar();
  }, [showModal]);

  // Initialize the AOS library with specified settings
  useEffect(() => {
    Aos.init({ duration: 550 });
  }, []);

  // Variants for button animations using framer-motion
  const buttonVariants = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  };

  return (
    <>
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
                    className='fa fa-globe'
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
                  transition={{ duration: 0.55 }}
                >
                  MY RESUME
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  className='btn btn-outlined'
                  data-aos='fade-down'
                  onClick={() => showModalHandler('contact')}
                  aria-label="Contact Me"
                  transition={{ duration: 0.55 }}
                >
                  CONTACT
                </motion.button>
              </div>
            </div>

            <div className={`${classes.columnRight} ${classes.profilePic}`}>
              {/* Image container with profile picture using Next.js Image component */}
              <div className={classes.imageContainer}>
                <Image
                  src={PROFILE_PIC_PATH}
                  width={600}
                  height={600}
                  alt='profile-pic'
                  data-aos='fade-left'
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "100%",
                    borderRadius: "50%",
                    objectFit: "contain"
                  }} 
                  priority={false} // Remove priority to avoid preloading issue
                  placeholder="blur"
                  blurDataURL={PROFILE_PIC_BLUR_DATA_URL}
                  sizes="(max-width: 767px) 300px, 600px" // Adjust size for mobile
                />
              </div>
              <div className={classes.quote} data-aos='fade-right'></div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {/* Display the modal when showModal is true */}
          {showModal && <Modal contact={modalType === 'contact'} resume={modalType === 'resume'} onClose={closeModalHandler} />}
        </AnimatePresence>
      </section>
      <Footer />
    </>
  );
};

// Export the Hero component
export default Hero;
