import React, { useState, useEffect, useCallback } from 'react';
import classes from './hero.module.scss';
import Image from "next/image";
import dynamic from 'next/dynamic';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for Modal with a skeleton loader
const Modal = dynamic(() => import('../layout/modal/modal'), {
  loading: () => <div className="skeleton-loader"></div>,
  ssr: false, // Disable SSR for the modal
});

const PGP_KEY_PATH = 'https://cdn.levine.io/uploads/portfolio/public/assets/dave.levine.io-pgp-key-pub.asc';
const PROFILE_PIC_PATH = 'https://cdn.levine.io/uploads/portfolio/public/images/profile-pic-1.webp';
const PROFILE_PIC_LOW_RES_PATH = 'https://cdn.levine.io/uploads/portfolio/public/images/profile-pic-1-low-res.webp';

const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [imageSrc, setImageSrc] = useState(PROFILE_PIC_LOW_RES_PATH);

  const showModalHandler = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  const aosProps = useCallback((animation, delay = 0, duration = 500) => ({
    'data-aos': animation,
    'data-aos-delay': delay,
    'data-aos-duration': duration,
  }), []);

  useEffect(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflow = showModal ? 'hidden' : 'auto';
    bodyStyle.paddingRight = '0px';
  }, [showModal]);

  useEffect(() => {
    Aos.init({ duration: 500, once: true });
  }, []);

  useEffect(() => {
    setImageSrc(window.innerWidth <= 767 ? PROFILE_PIC_LOW_RES_PATH : PROFILE_PIC_PATH);
  }, []);

  return (
    <section className={classes.greetings}>
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.columnLeft}>
            <h2 {...aosProps('fade-left')}>Hey, I&apos;m{' '}
              <span className={classes.name}>Dave</span>!{' '}
            </h2>
            <h1 {...aosProps('fade-right')}>Solutions Engineer</h1>
            <h3 {...aosProps('fade-left', 100)}>
              I design and implement systems
              <span className={classes.punctuation}><b>.</b></span>
            </h3>
            <div className={classes.socialMedia}>
              <a href='https://github.com/davelevine' target='_blank' rel='noreferrer' aria-label="GitHub Profile">
                <i className='fab fa-github' {...aosProps('flip-up', 100)}></i>
              </a>
              <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer' aria-label="LinkedIn Profile">
                <i className='fab fa-linkedin' {...aosProps('flip-up', 150)}></i>
              </a>{' '}
              <a href='https://kb.levine.io' target='_blank' rel='noreferrer' aria-label="Knowledge Base">
                <i className='fa fa-globe' {...aosProps('flip-up', 200)}></i>
              </a>
              <a href='/rss.xml' target='_blank' rel='noreferrer' aria-label="RSS Feed">
                <i className='fa fa-square-rss' {...aosProps('flip-up', 250)} style={{ fontSize: '2.02em', verticalAlign: 'baseline' }}></i>
              </a>
              <a href={PGP_KEY_PATH} target='_blank' rel='noreferrer' aria-label="PGP Key">
                <i className='fa-sharp fa-regular fa fa-key' {...aosProps('flip-up', 300)}></i>
              </a>
            </div>
            <div className={classes.ctaButtons}>
              <motion.button
                className='btn btn-filled'
                {...aosProps('fade-up', 100)}
                onClick={() => showModalHandler('resume')}
                aria-label="My Resume"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0px 0px 8px rgb(0, 0, 0)",
                  transition: { duration: 0.001 }
                }}
              >
                MY RESUME
              </motion.button>
              <motion.button
                className='btn btn-outlined'
                {...aosProps('fade-down', 100)}
                onClick={() => showModalHandler('contact')}
                aria-label="Contact Me"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0px 0px 8px rgb(0, 0, 0)",
                  transition: { duration: 0.001 }
                }}
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
                {...aosProps('fade-left', 50)}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "50%",
                  objectFit: "contain"
                }} 
                priority={true}
                placeholder="blur"
                blurDataURL={PROFILE_PIC_LOW_RES_PATH}
                sizes="(max-width: 767px) 480px, 640px"
              />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showModal && <Modal contact={modalType === 'contact'} resume={modalType === 'resume'} onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

export default React.memo(Hero);
