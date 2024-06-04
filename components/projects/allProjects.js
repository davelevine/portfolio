import classes from './allProjects.module.scss';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectItem from './projectItem';

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

  return (
    <div className={classes.projectsGallery}>
      <div className={classes.container}>
        <h1>PROJECTS</h1>
        <div className={classes.filter}>
          <h3>
            <p>Sort By Tech:</p>
          </h3>
          <div className={classes.filterButtons}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick('all')}
              className={`btn btn-outlined sm ${activeButton === 'all' ? 'active' : ''}`}
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
              >
                {tech}
              </motion.button>
            ))}
          </div>
        </div>

        <div className={classes.galleryWrap}>
          <div className={classes.gallery}>
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectItem key={`project-${project.id}`} project={project} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
