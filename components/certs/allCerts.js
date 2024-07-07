import classes from './allCerts.module.scss';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CertItem from './certItem';
import Modal from '../layout/modal/contactModal'; // Import the contact modal
import useModal from '../layout/modal/useModal'; // Custom hook for modal logic

const AllCerts = ({ certs }) => {
  // State to control selected filter
  const [filter, setFilter] = useState('all');
  // State to control the active button
  const [activeButton, setActiveButton] = useState('all');
  // Custom hook for modal logic
  const { showModal, modalType, showModalHandler, closeModalHandler } = useModal();

  // Extract unique techs from certs and sort them
  const sortedUniqueTechs = useMemo(() => {
    const selectedCerts = new Set();
    certs.forEach((cert) => {
      const techs = cert.tech;
      if (Array.isArray(techs)) {
        techs.forEach((tech) => {
          selectedCerts.add(tech);
        });
      }
    });
    return [...selectedCerts].sort();
  }, [certs]);

  // Set document title once on mount
  useEffect(() => {
    document.title = 'Dave Levine - Certs';
  }, []);

  // Handle button click to set filter and active button
  const handleClick = useCallback((tech) => {
    setFilter(tech);
    setActiveButton(tech);
  }, []);

  // Effects for managing body overflow when the modal is open or closed
  useEffect(() => {
    const hideScrollbar = () => {
      document.body.style.overflow = showModal ? 'hidden' : 'auto';
      document.body.style.paddingRight = showModal ? '15px' : '0px';
    };

    hideScrollbar();
  }, [showModal]);

  // Common sorting logic for certs
  const commonSortLogic = useCallback((a, b) => {
    const isALegacy = a.title.includes('(Legacy)');
    const isBLegacy = b.title.includes('(Legacy)');

    if (isALegacy && isBLegacy) {
      return a.title.localeCompare(b.title);
    } else if (isALegacy) {
      return 1;
    } else if (isBLegacy) {
      return -1;
    } else {
      const hasExpirationDateA = a.expirationDate;
      const hasExpirationDateB = b.expirationDate;

      if (hasExpirationDateA && hasExpirationDateB) {
        return a.expirationDate.localeCompare(b.expirationDate);
      } else if (hasExpirationDateA) {
        return -1;
      } else if (hasExpirationDateB) {
        return 1;
      } else {
        return b.isFeatured - a.isFeatured;
      }
    }
  }, []);

  // Filter and sort certs based on the selected filter
  const filteredCerts = useMemo(() => {
    return filter === 'all'
      ? certs.slice().sort(commonSortLogic)
      : certs.filter((cert) => cert.tech.includes(filter)).sort(commonSortLogic);
  }, [certs, filter, commonSortLogic]);

  // Check if the screen width is greater than 768px (desktop)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;

  // Motion variants for buttons
  const buttonVariants = isDesktop
    ? { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } }
    : {};

  return (
    <section className={classes.blog}>
      <div className={classes.container}>
        <motion.h1
          initial={isDesktop ? { opacity: 0, x: -600 } : {}}
          animate={isDesktop ? { opacity: 1, x: 0 } : {}}
          transition={isDesktop ? { duration: 0.4, ease: "easeInOut" } : {}}
        >
          CERTIFICATIONS
        </motion.h1>
        <div className={classes.filter}>
          <motion.h3
            initial={isDesktop ? { opacity: 0, x: 300 } : {}}
            animate={isDesktop ? { opacity: 1, x: 0 } : {}}
            transition={isDesktop ? { duration: 0.4, ease: "easeInOut" } : {}}
          >
            <p>Sort By Topic</p>
          </motion.h3>
          <motion.div
            className={classes.filterButtons}
            initial={isDesktop ? "hidden" : "visible"}
            animate="visible"
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  staggerChildren: 0.1,
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
        {/* Display the modal when showModal is true */}
        {showModal && <Modal contact={modalType === 'contact'} onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

export default AllCerts;