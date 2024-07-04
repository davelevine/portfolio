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

  return (
    <section className={classes.blog}>
      <div className={classes.container}>
        <h1>CERTIFICATIONS</h1>
        <div className={classes.filter}>
          <h3><p>Sort By Topic:</p></h3>
          <div className={classes.filterButtons}>
            <button
              onClick={() => handleClick('all')}
              className={
                activeButton === 'all'
                  ? 'btn btn-outlined sm active'
                  : 'btn btn-outlined sm'
              }
            >
              All
            </button>
            {sortedUniqueTechs.map((tech) => (
              <button
                onClick={() => handleClick(tech)}
                className={
                  activeButton === tech
                    ? 'btn btn-outlined sm active'
                    : 'btn btn-outlined sm'
                }
                key={tech}
              >
                {tech}
              </button>
            ))}
          </div>
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
