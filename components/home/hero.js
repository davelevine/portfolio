import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classes from './hero.module.scss';
import Image from "next/image";
import dynamic from 'next/dynamic';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';

const Modal = dynamic(() => import('../layout/modal/modal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

const PGP_KEY_PATH = 'https://cdn.levine.io/uploads/portfolio/public/assets/dave.levine.io-pgp-key-pub.asc';
const PROFILE_PIC_PATH = 'https://cdn.levine.io/uploads/portfolio/public/images/profile-pic-1.webp';
const PROFILE_PIC_LOW_RES_PATH = 'https://cdn.levine.io/uploads/portfolio/public/images/profile-pic-1-low-res.webp';

const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [imageSrc, setImageSrc] = useState(PROFILE_PIC_LOW_RES_PATH);

  const showModalHandler = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0px';
  }, [showModal]);

  useEffect(() => {
    Aos.init({ duration: 550 });
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      setIsHorizontal(window.innerWidth > window.innerHeight && window.innerWidth <= 1080);
    };

    const updateImageSrc = () => {
      setImageSrc(window.matchMedia("(max-width: 767px)").matches ? PROFILE_PIC_LOW_RES_PATH : PROFILE_PIC_PATH);
    };

    const debouncedCheckOrientation = debounce(checkOrientation, 100);
    const debouncedUpdateImageSrc = debounce(updateImageSrc, 100);

    checkOrientation();
    updateImageSrc();
    window.addEventListener('resize', debouncedCheckOrientation);
    window.addEventListener('resize', debouncedUpdateImageSrc);

    return () => {
      window.removeEventListener('resize', debouncedCheckOrientation);
      window.removeEventListener('resize', debouncedUpdateImageSrc);
    };
  }, []);

  const buttonVariants = useMemo(() => ({
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  }), []);

  return (
    <>
      <section className={classes.greetings}>
        <div className={classes.container}>
          <div className={classes.row}>
            <div className={classes.columnLeft}>
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
              <div className={classes.imageContainer}>
                <Image
                  src={imageSrc}
                  width={640}
                  height={640}
                  alt='profile-pic'
                  data-aos='fade-left'
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "100%",
                    borderRadius: "50%",
                    objectFit: "contain"
                  }} 
                  priority={true}
                  placeholder="blur"
                  blurDataURL={PROFILE_PIC_LOW_RES_PATH}
                  sizes="(max-width: 767px) 320px, 640px"
                />
              </div>
              <div className={classes.quote} data-aos='fade-right'></div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showModal && <Modal contact={modalType === 'contact'} resume={modalType === 'resume'} onClose={closeModalHandler} />}
        </AnimatePresence>
      </section>
    </>
  );
};

export default React.memo(Hero);
