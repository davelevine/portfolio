// hero.js
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/legacy/image';
import { motion, AnimatePresence } from 'framer-motion';
import classes from './hero.module.scss';
import Modal from '../layout/modal/modal';
import Aos from 'aos';
import 'aos/dist/aos.css';

const RESUME_FILE_PATH = '/assets/davelevine-resume.pdf';
const MOBILE_PROFILE_IMAGE_PATH = '/images/profile-pic-1-mobile.webp';
const DESKTOP_PROFILE_IMAGE_PATH = '/images/profile-pic-1-desktop.webp';

const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const handleButtonClick = useCallback((path) => {
    window.location.href = path;
  }, []);

  const showModalHandler = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

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

  useEffect(() => {
    Aos.init({ duration: 550 });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateIsMobile = () => {
        setIsMobile(window.innerWidth <= 767);
      };

      updateIsMobile();
      window.addEventListener('resize', updateIsMobile);

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
            <h2 data-aos='fade-left'>Hey, I&apos;m <span className={classes.name}>Dave</span>! </h2>
            <h1 data-aos='fade-right'>Solutions Engineer</h1>
            <h3 data-aos='fade-left' data-aos-delay='200'>
              I design and implement systems<span className={classes.punctuation}><b>.</b></span>
            </h3>
            <div className={classes.socialMedia}>
              <a href='https://github.com/davelevine' target='_blank' rel='noreferrer' aria-label="GitHub Profile">
                <i className='fab fa-github' data-aos='flip-up'></i>
              </a>
              <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer' aria-label="LinkedIn Profile">
                <i className='fab fa-linkedin' data-aos='flip-up' data-aos-delay='100'></i>
              </a>
              <a href='https://kb.levine.io' target='_blank' rel='noreferrer' aria-label="Knowledge Base">
                <i className='fas fa-globe' data-aos='flip-up' data-aos-delay='200'></i>
              </a>
              <a href='/assets/dave.levine.io-pgp-key-pub.asc' target='_blank' rel='noreferrer' aria-label="PGP Key">
                <i className='fa fa-key' data-aos='flip-up' data-aos-delay='300'></i>
              </a>
            </div>
            <div className={classes.ctaButtons}>
              <motion.button
                variants={buttonVariants}
                className='btn btn-filled'
                data-aos='fade-up'
                onClick={() => showModalHandler('resume')}
                aria-label="My Resume"
                transition={{ duration: 0.55 }}>
                MY RESUME
              </motion.button>
              <motion.button
                variants={buttonVariants}
                className='btn btn-outlined'
                data-aos='fade-down'
                onClick={() => showModalHandler('contact')}
                aria-label="Contact Me"
                transition={{ duration: 0.55 }}>
                CONTACT
              </motion.button>
            </div>
          </div>
          <div className={`${classes.columnRight} ${classes.profilePic}`}>
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
        {showModal && <Modal contact={modalType === 'contact'} resume={modalType === 'resume'} onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
