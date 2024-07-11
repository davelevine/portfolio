import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './allProjects.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectItem from './projectItem';
import { useInView } from 'react-intersection-observer';
import Modal from '../layout/modal/contactModal'; // Import the contact modal

const ProjectItemWithAnimation = ({ project }) => {
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
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ display: 'grid' }}
    >
      <ProjectItem project={project} />
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
  const [isDesktop, setIsDesktop] = useState(false);

  // Ensure that each project has an id before proceeding
  const validProjects = useMemo(() => projects.filter(project => project.id), [projects]);

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

  // Set document title once on mount
  useEffect(() => {
    document.title = 'Dave Levine - Projects';

    // Check if the screen width is greater than 768px (desktop)
    const updateIsDesktop = () => setIsDesktop(window.innerWidth > 768);
    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);

    return () => {
      window.removeEventListener('resize', updateIsDesktop);
    };
  }, []);

  // Handle button click
  const handleClick = useCallback((tech) => {
    setFilter(tech);
    setActiveButton(tech);
  }, []);

  // Function to open the modal
  const showModalHandler = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  // Function to close the modal
  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  // Effects for managing body overflow when the modal is open or closed
  useEffect(() => {
    const hideScrollbar = () => {
      document.body.style.overflow = showModal ? 'hidden' : 'auto';
      document.body.style.paddingRight = showModal ? '15px' : '0px';
    };

    hideScrollbar();
  }, [showModal]);

  // Filter projects based on selected tech
  const filteredProjects = useMemo(() => {
    return filter === 'all'
      ? validProjects.sort((a, b) => b.isFeatured - a.isFeatured)
      : validProjects.filter(({ tech }) => tech.includes(filter));
  }, [filter, validProjects]);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1, // Trigger when 10% of the item is visible
  });

  // Motion variants for buttons
  const buttonVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  // Handle scroll progress bar with debounce
  useEffect(() => {
    if (isDesktop) {
      const handleScroll = () => {
        const scrollProgress = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100;
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
          progressBar.style.width = `${scrollProgress}%`;
        }
      };

      const debounceHandleScroll = debounce(handleScroll, 100);

      window.addEventListener('scroll', debounceHandleScroll);

      return () => {
        window.removeEventListener('scroll', debounceHandleScroll);
      };
    }
  }, [isDesktop]);

  return (
    <section className={classes.projectsGallery}>
      {isDesktop && <div id="scroll-progress" className={classes.scrollProgress}></div>}
      <div className={classes.container}>
        <motion.h1
          initial={{ opacity: 0, x: -600 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          PROJECTS
        </motion.h1>
        <div className={classes.filter}>
          <motion.h3
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
            {selectedTechs.map((tech) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleClick(tech)}
                className={`btn btn-outlined sm ${activeButton === tech ? 'active' : ''}`}
                key={tech}
                variants={{
                  hidden: { opacity: 0, x: 100 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } }
                }}
              >
                {tech}
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
      {/* Display the modal when showModal is true */}
      {showModal && <Modal contact={modalType === 'contact'} onClose={closeModalHandler} />}
    </section>
  );
};

AllProjects.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    tech: PropTypes.arrayOf(PropTypes.string).isRequired,
    isFeatured: PropTypes.bool.isRequired,
  })).isRequired,
};

// Debounce function to limit the rate at which a function can fire.
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default AllProjects;
