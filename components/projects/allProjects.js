import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './allProjects.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectItem from './projectItem';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import Image from 'next/image'; // Importing Image from next/image

// Dynamically import the Modal component for code splitting
const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader" role="status" aria-live="polite"></div>,
});

// Custom Hook for Scroll Progress
const useScrollProgress = () => {
  const handleScroll = useCallback(() => {
    const scrollProgress = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) progressBar.style.width = `${scrollProgress}%`;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};

// Custom Hook for Lazy Loading Images
const useLazyLoadImages = () => {
  const lazyLoadImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      if (img.getBoundingClientRect().top < window.innerHeight + 100) { // Load images slightly before they come into view
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }, []);

  useEffect(() => {
    const handleWindowLoad = () => {
      lazyLoadImages();
      window.addEventListener('scroll', lazyLoadImages);
    };

    window.addEventListener('load', handleWindowLoad);
    return () => {
      window.removeEventListener('load', handleWindowLoad);
      window.removeEventListener('scroll', lazyLoadImages);
    };
  }, [lazyLoadImages]);
};

// Component to animate project items when they come into view
const ProjectItemWithAnimation = ({ project }) => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Animate only once when in view
    threshold: 0.1, // Trigger earlier for better perceived performance on mobile
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.5 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.5 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }} // Speed up the animation
      role="listitem"
    >
      <ProjectItem project={project} lazyLoad={inView} />
    </motion.div>
  );
};

ProjectItemWithAnimation.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const AllProjects = ({ projects }) => {
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Initialize custom hooks
  useScrollProgress();
  useLazyLoadImages();

  const validProjects = useMemo(() => projects.filter(({ id }) => id), [projects]);

  const selectedTechs = useMemo(() => {
    const techs = new Set();
    validProjects.forEach(({ tech }) => {
      if (Array.isArray(tech)) {
        tech.forEach(techs.add, techs);
      }
    });
    return Array.from(techs).sort();
  }, [validProjects]);

  useEffect(() => {
    document.title = 'Dave Levine - Projects';
  }, []);

  const handleFilterClick = useCallback((tech) => {
    setFilter(tech);
    setActiveButton(tech);
  }, []);

  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  const filteredProjects = useMemo(() => {
    return filter === 'all'
      ? validProjects.sort((a, b) => b.isFeatured - a.isFeatured)
      : validProjects.filter(({ tech }) => tech.includes(filter));
  }, [filter, validProjects]);

  return (
    <section className={classes.projectsGallery} aria-labelledby="projects-heading">
      <div id="scroll-progress" className={classes.scrollProgress} role="progressbar" aria-label="Scroll progress"></div>
      <div className={classes.container}>
        <motion.h1
          id="projects-heading"
          initial={{ opacity: 0, x: -600 }} // Restored original animation for title
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }} // Original duration
          tabIndex="0"
        >
          PROJECTS
        </motion.h1>
        <div className={classes.filter}>
          <motion.h3
            initial={{ opacity: 0, x: 300 }} // Restored original animation for "Sort by Tech"
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }} // Original duration
          >
            <p>Sort By Tech</p>
          </motion.h3>
          <motion.div
            className={classes.filterButtons}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, x: 100 }, // Restored original animation
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  staggerChildren: 0.05, // Speed up the tech logo animation
                  duration: 0.3,
                  ease: 'easeInOut',
                },
              },
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1, translateY: -2 }} // Your preferred hover effect for buttons
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterClick('all')}
              className={`btn btn-outlined sm ${activeButton === 'all' ? 'active' : ''}`}
              variants={{
                hidden: { opacity: 0, x: 100 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
              }}
              style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-pressed={activeButton === 'all'}
            >
              <div className={classes.techLogoContainer}>
                <i className="fa-regular fa-asterisk" style={{ fontSize: '32px', color: 'currentColor' }} aria-hidden="true"></i>
                <span className={classes.techLogoName}>All</span>
              </div>
            </motion.button>
            {selectedTechs.map((tech) => (
              <motion.button
                whileHover={{ scale: 1.1, translateY: -2 }} // Your preferred hover effect for buttons
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterClick(tech)}
                className={`btn btn-outlined sm ${activeButton === tech ? 'active' : ''}`}
                key={tech}
                variants={{
                  hidden: { opacity: 0, x: 100 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
                }}
                style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-pressed={activeButton === tech}
              >
                <div className={classes.techLogoContainer}>
                  <Image
                    src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/logos/${tech}.svg`}
                    alt={tech}
                    className={classes.techLogo}
                    width={32} // Set width for Image component
                    height={32} // Set height for Image component
                    style={{borderRadius: '50%', objectFit: 'contain'}}
                    loading="lazy"
                  />
                  <span className={classes.techLogoName}>{tech}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className={classes.galleryWrap}>
          <div className={classes.gallery} role="list">
            {filteredProjects.map((project) => (
              <ProjectItemWithAnimation key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>{showModal && <Modal contact={modalType === 'contact'} onClose={closeModalHandler} />}</AnimatePresence>
    </section>
  );
};

AllProjects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      tech: PropTypes.arrayOf(PropTypes.string).isRequired,
      isFeatured: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default AllProjects;
