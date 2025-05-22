import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classes from './hero.module.scss';
import Image from "next/image";
import dynamic from 'next/dynamic';
import 'aos/dist/aos.css';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import with improved loading
const Modal = dynamic(() => import('../layout/modal/modal'), {
  loading: () => <div className="skeleton-loader" aria-label="Loading content..."></div>,
  ssr: false,
});

// Constants moved outside component
const PGP_KEY_PATH = 'https://cdn.levine.io/uploads/portfolio/public/assets/dave.levine.io-pgp-key-pub.asc';
const PROFILE_PIC_PATH = 'https://cdn.levine.io/uploads/portfolio/public/images/profile-pic-1.webp';
const PROFILE_PIC_LOW_RES_PATH = 'https://cdn.levine.io/uploads/portfolio/public/images/profile-pic-1-low-res.webp';

// Social media links data
const SOCIAL_LINKS = [
  { href: 'https://github.com/davelevine', icon: 'fab fa-github', label: 'GitHub Profile', delay: 100 },
  { href: 'https://www.linkedin.com/in/iamdavelevine', icon: 'fab fa-linkedin', label: 'LinkedIn Profile', delay: 150 },
  { href: 'https://kb.levine.io', icon: 'fa fa-globe', label: 'Knowledge Base', delay: 200 },
  { href: '/rss.xml', icon: 'fa fa-square-rss', label: 'RSS Feed', delay: 250, style: { fontSize: '2.02em', verticalAlign: 'baseline' } },
  { href: PGP_KEY_PATH, icon: 'fa-sharp fa-regular fa fa-key', label: 'PGP Key', delay: 300 }
];

// Button hover animation
const buttonHoverAnimation = {
  scale: 1.05,
  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)",
  transition: { duration: 0.2 }
};

const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Better image strategy with correct SSR handling
  const [imageSrc, setImageSrc] = useState(PROFILE_PIC_LOW_RES_PATH);
  const [windowWidth, setWindowWidth] = useState(0);

  // Memoized AOS props function
  const aosProps = useCallback((animation, delay = 0, duration = 500) => ({
    'data-aos': animation,
    'data-aos-delay': delay,
    'data-aos-duration': duration,
  }), []);

  const showModalHandler = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  // Combined useEffect for initializations
  useEffect(() => {
    // Import AOS only on client side
    const Aos = require('aos');
    Aos.init({ duration: 500, once: true });

    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Window resize handler with debounce
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Update image source based on screen size
  useEffect(() => {
    if (windowWidth === 0) return;
    setImageSrc(windowWidth <= 767 ? PROFILE_PIC_LOW_RES_PATH : PROFILE_PIC_PATH);
  }, [windowWidth]);

  // Control body scroll when modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = showModal ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // Memoize social media links
  const socialLinks = useMemo(() => 
    SOCIAL_LINKS.map(({href, icon, label, delay, style}) => (
      <a 
        key={href} 
        href={href} 
        target='_blank' 
        rel='noreferrer' 
        aria-label={label}
      >
        <i 
          className={icon} 
          {...aosProps('flip-up', delay)}
          style={style}
        ></i>
      </a>
    )), [aosProps]);

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
              {socialLinks}
            </div>
            <div className={classes.ctaButtons}>
              <motion.button
                className='btn btn-filled'
                {...aosProps('fade-up', 100)}
                onClick={() => showModalHandler('resume')}
                aria-label="My Resume"
                whileHover={buttonHoverAnimation}
              >
                MY RESUME
              </motion.button>
              <motion.button
                className='btn btn-outlined'
                {...aosProps('fade-down', 100)}
                onClick={() => showModalHandler('contact')}
                aria-label="Contact Me"
                whileHover={buttonHoverAnimation}
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
                alt='Dave Levine - Solutions Engineer'
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
                sizes="(max-width: 767px) 80vw, (max-width: 1200px) 40vw, 640px"
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
