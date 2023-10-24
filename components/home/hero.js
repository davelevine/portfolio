import classes from './hero.module.scss';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Modal from '../layout/modal/modal';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [showModal, setShowModal] = useState();

  function buttonHandler() {
    window.location.href = '#projects';
  }

  function showModalHandler() {
    setShowModal(true);
  }

  function closeModalHandler() {
    setShowModal(false);
  }

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    if (!showModal) document.body.style.overflow = 'unset';
  }, [showModal]);

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  return (
    <section className={classes.greetings}>
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.columnLeft}>
            <h2 data-aos='fade-left'>Hey, I'm Dave.</h2>
            <h1 data-aos='fade-right'>I'm a Solutions Engineer.</h1>
            <h4 data-aos='fade-left' data-aos-delay='150'>
              I design and implement{' '}
              <span>
              </span>{' '}
              system architecture.
            </h4>
            <div className={classes.socialMedia}>
              <a href='https://github.com/davelevine' target='_blank' rel='noreferrer'>
                <i className='fab fa-github' data-aos='flip-up'></i>
              </a>
              <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer'>
                <i
                  className='fab fa-linkedin'
                  data-aos='flip-up'
                  data-aos-delay='50'></i>
              </a>{' '}
              <a href='mailto:dave@levine.org' target='_blank' rel='noreferrer'>
                <i
                  className='fa-regular fa-envelope'
                  data-aos='flip-up'
                  data-aos-delay='100'></i>
              </a>{' '}
              <a href='https://kb.levine.org' target='_blank' rel='noreferrer'>
                <i
                  className='fa-solid fa-sitemap'
                  data-aos='flip-up'
                  data-aos-delay='150'></i>
              </a>
            </div>
            <div className={classes.ctaButtons}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='btn btn-filled'
                data-aos='fade-up'
                onClick={buttonHandler}>
                My Work
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='btn btn-outlined'
                data-aos='fade-down'
                onClick={showModalHandler}>
                Let&apos;s Talk
              </motion.button>
            </div>
          </div>

          <div className={`${classes.columnRight} ${classes.profilePic}`}>
            <Image
              src='/portfolio/images/profile-pic.webp'
              width={460}
              height={460}
              alt='profile-pic'
              data-aos='fade-left'
            />
          </div>
        </div>
        <div className='iconScrollContainer'>
          <a href='#projects'>
            <div
              className='iconScroll'
              data-aos='fade-down'
              data-aos-offset='50'></div>
          </a>
        </div>
      </div>
      <AnimatePresence>
        {showModal && <Modal contact onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};
export default Hero;
