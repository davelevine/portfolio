import classes from './allCerts.module.scss';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CertItem from './certItem';
import { useInView } from 'react-intersection-observer';

const CertItemWithAnimation = ({ cert }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1, // Trigger when 10% of the item is visible
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.5 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.5 }}
      exit={{ opacity: 0, y: -100, scale: 0.5 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ display: 'grid' }}
    >
      <CertItem cert={cert} />
    </motion.div>
  );
};

const AllCerts = ({ certs }) => {
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');

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

  // Update document title on filter or certs change
  useEffect(() => {
    document.title = 'Dave Levine - Certs';
  }, [filter, certs]);

  // Handle button click to set filter and active button
  const handleClick = useCallback((tech) => {
    setFilter(tech);
    setActiveButton(tech);
  }, []);

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
          <h3><p>Sort By Topic:</p></h3>
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
              className={
                activeButton === 'all'
                  ? 'btn btn-outlined sm active'
                  : 'btn btn-outlined sm'
              }
              variants={isDesktop ? { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } } : {}}
            >
              All
            </motion.button>
            {sortedUniqueTechs.map((tech) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleClick(tech)}
                className={
                  activeButton === tech
                    ? 'btn btn-outlined sm active'
                    : 'btn btn-outlined sm'
                }
                key={tech}
                variants={isDesktop ? { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } } : {}}
              >
                {tech}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className={classes.galleryWrap}>
          <div className={classes.gallery}>
            <AnimatePresence>
              {filteredCerts.map((cert) => (
                <CertItemWithAnimation key={cert.slug} cert={cert} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCerts;
