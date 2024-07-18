import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import classes from './allCerts.module.scss';
import CertItem from './certItem';
import useModal from '../layout/modal/useModal';

// Dynamically import the Modal component for code splitting
const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

const AllCerts = ({ certs }) => {
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');
  const [isDesktop, setIsDesktop] = useState(false);

  const { showModal, modalType, closeModalHandler } = useModal();

  const sortedUniqueTechs = useMemo(() => {
    const techSet = new Set();
    certs.forEach(cert => {
      if (Array.isArray(cert.tech)) {
        cert.tech.forEach(tech => techSet.add(tech));
      }
    });
    return [...techSet].sort();
  }, [certs]);

  useEffect(() => {
    document.title = 'Dave Levine - Certs';

    const updateIsDesktop = () => setIsDesktop(window.innerWidth > 768);
    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);

    return () => window.removeEventListener('resize', updateIsDesktop);
  }, []);

  const handleClick = useCallback((tech) => {
    setFilter(tech);
    setActiveButton(tech);
  }, []);

  useEffect(() => {
    const hideScrollbar = () => {
      document.body.style.overflow = showModal ? 'hidden' : 'auto';
      document.body.style.paddingRight = showModal ? '15px' : '0px';
    };

    hideScrollbar();

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, [showModal]);

  const commonSortLogic = useCallback((a, b) => {
    const isALegacy = a.title.includes('(Legacy)');
    const isBLegacy = b.title.includes('(Legacy)');

    if (isALegacy && isBLegacy) return a.title.localeCompare(b.title);
    if (isALegacy) return 1;
    if (isBLegacy) return -1;

    if (a.expirationDate && b.expirationDate) return a.expirationDate.localeCompare(b.expirationDate);
    if (a.expirationDate) return -1;
    if (b.expirationDate) return 1;

    return b.isFeatured - a.isFeatured;
  }, []);

  const filteredCerts = useMemo(() => {
    return filter === 'all'
      ? certs.slice().sort(commonSortLogic)
      : certs.filter(cert => cert.tech.includes(filter)).sort(commonSortLogic);
  }, [certs, filter, commonSortLogic]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) progressBar.style.width = `${scrollProgress}%`;
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const buttonVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  return (
    <section className={classes.blog}>
      <div id="scroll-progress" className={classes.scrollProgress}></div>
      <div className={classes.container}>
        <motion.h1
          initial={{ opacity: 0, x: -600 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          CERTIFICATIONS
        </motion.h1>
        <div className={classes.filter}>
          <motion.h3
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p>Sort By Topic</p>
          </motion.h3>
          <motion.div
            className={classes.filterButtons}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  staggerChildren: 0.1,
                  duration: 0.3,
                  ease: "easeInOut"
                },
              },
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick('all')}
              className={`btn btn-outlined sm ${activeButton === 'all' ? 'active' : ''}`}
              variants={buttonVariants}
            >
              All
            </motion.button>
            {sortedUniqueTechs.map((tech) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleClick(tech)}
                className={`btn btn-outlined sm ${activeButton === tech ? 'active' : ''}`}
                key={tech}
                variants={buttonVariants}
              >
                {tech}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className={classes.galleryWrap}>
          <div className={classes.gallery}>
            {filteredCerts.map((cert) => (
              <div key={cert.slug} style={{ display: 'grid' }}>
                <CertItem cert={cert} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showModal && <Modal contact={modalType === 'contact'} onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

export default AllCerts;
