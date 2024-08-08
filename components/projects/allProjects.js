import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './allProjects.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectItem from './projectItem';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

// Dynamically import the Modal component for code splitting
const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

// Component to animate project items when they come into view
const ProjectItemWithAnimation = ({ project }) => {
  const [ref, inView, entry] = useInView({
    triggerOnce: false, // Set to false to allow repeated triggering
    threshold: 0.1, // Trigger when 10% of the item is visible
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.5 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.5 }}
      exit={{ opacity: 0, y: -100, scale: 0.5 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{ display: 'grid' }}
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
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalType, setModalType] = useState(''); // State to determine modal type

  // Ensure that each project has an id before proceeding
  const validProjects = useMemo(() => projects.filter((project) => project.id), [projects]);

  // Memoize selectedTechs using Set directly
  const selectedTechs = useMemo(() => {
    const techs = new Set();
    validProjects.forEach(({ tech }) => {
      if (Array.isArray(tech)) {
        tech.forEach((t) => techs.add(t));
      }
    });
    return Array.from(techs).sort();
  }, [validProjects]);

  // Set document title on mount
  useEffect(() => {
    document.title = 'Dave Levine - Projects';
  }, []);

  // Handle button click to set filter and active button
  const handleFilterClick = useCallback((tech) => {
    setFilter(tech);
    setActiveButton(tech);
  }, []);

  // Function to close the modal
  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  // Manage body overflow when the modal is open or closed
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
    document.body.style.paddingRight = showModal ? '15px' : '0px';
  }, [showModal]);

  // Filter projects based on selected tech
  const filteredProjects = useMemo(() => {
    return filter === 'all'
      ? validProjects.sort((a, b) => b.isFeatured - a.isFeatured)
      : validProjects.filter(({ tech }) => tech.includes(filter));
  }, [filter, validProjects]);

  // Motion variants for buttons
  const buttonVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  // Function to handle scroll and update progress bar
  const handleScroll = useCallback(() => {
    const scrollProgress =
      (document.documentElement.scrollTop /
        (document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
      100;
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) progressBar.style.width = `${scrollProgress}%`;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Initial call to set the progress bar width
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Function to lazy load images
  const lazyLoadImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      if (img.getBoundingClientRect().top < window.innerHeight) {
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

  return (
    <section className={classes.projectsGallery}>
      <div id="scroll-progress" className={classes.scrollProgress}></div>
      <div className={classes.container}>
        <motion.h1
          initial={{ opacity: 0, x: -600 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          PROJECTS
        </motion.h1>
        <div className={classes.filter}>
          <motion.h3
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p>Sort By Tech</p>
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
                  ease: 'easeInOut',
                },
              },
            }}
          >
            <motion.button
              whileHover={{ scale: 1.2, translateY: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleFilterClick('all')}
              className={`btn btn-outlined sm ${activeButton === 'all' ? 'active' : ''}`}
              variants={buttonVariants}
              style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div className={classes.techLogoContainer}>
                <i className="fa-regular fa-asterisk" style={{ fontSize: '32px', color: 'currentColor' }}></i>
                <span className={classes.techLogoName}>All</span>
              </div>
            </motion.button>
            {selectedTechs.map((tech) => (
              <motion.button
                whileHover={{ scale: 1.2, translateY: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFilterClick(tech)}
                className={`btn btn-outlined sm ${activeButton === tech ? 'active' : ''}`}
                key={tech}
                variants={buttonVariants}
                style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className={classes.techLogoContainer}>
                  <img
                    src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/logos/${tech}.svg`}
                    alt={tech}
                    className={classes.techLogo}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain' }}
                  />
                  <span className={classes.techLogoName}>{tech}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className={classes.galleryWrap}>
          <div className={classes.gallery}>
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
