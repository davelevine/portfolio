import classes from './allProjects.module.scss';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectItem from './projectItem';
import { useInView } from 'react-intersection-observer';

const AllProjects = ({ projects }) => {
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');

  // Memoize selectedTechs
  const selectedTechs = useMemo(() => {
    const techs = new Set();
    projects.forEach(({ tech }) => {
      if (Array.isArray(tech)) {
        tech.forEach((t) => techs.add(t));
      }
    });
    return Array.from(techs).sort();
  }, [projects]);

  // Update document title
  useEffect(() => {
    document.title = 'Dave Levine - Projects';
  }, []);

  // Handle button click
  const handleClick = useCallback((tech) => {
    setFilter(tech);
    setActiveButton(tech);
  }, []);

  // Filter projects based on selected tech
  const filteredProjects = useMemo(() => {
    return filter === 'all'
      ? projects.sort((a, b) => b.isFeatured - a.isFeatured)
      : projects.filter(({ tech }) => tech.includes(filter));
  }, [filter, projects]);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1, // Trigger when 10% of the item is visible
  });

  return (
    <div ref={ref} className={classes.projectsGallery}>
      <div className={classes.container}>
        <h1>PROJECTS</h1>
        <div className={classes.filter}>
          <h3>
            <p>Sort By Tech:</p>
          </h3>
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
                },
              },
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick('all')}
              className={`btn btn-outlined sm ${activeButton === 'all' ? 'active' : ''}`}
              variants={{ hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } }}
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
                variants={{ hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } }}
              >
                {tech}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className={classes.galleryWrap}>
          <div className={classes.gallery}>
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={`project-${project.id}`}
                  initial={{ opacity: 0, y: 100, scale: 0.5 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.5 }}
                  exit={{ opacity: 0, y: -100, scale: 0.5 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ display: 'grid' }}
                >
                  <ProjectItem project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
