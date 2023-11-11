import classes from './allProjects.module.scss';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectItem from './projectItem';

const AllProjects = (props) => {
  const { projects } = props;
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');

  // Memoize selectedTechs
  const selectedTechs = useMemo(() => {
    const techs = [];
    projects.forEach((project) => {
      const projectTechs = project.tech;
      if (Array.isArray(projectTechs)) {
        projectTechs.forEach((tech) => {
          if (!techs.includes(tech)) techs.push(tech);
        });
      }
    });
    return techs.sort();
  }, [projects]);

  const handleClick = (tech) => {
    setFilter(tech);
    setActiveButton(tech);
  };

  const filteredProjects =
    filter === 'all'
      ? projects.sort((a, b) => b.isFeatured - a.isFeatured)
      : projects.filter((project) => project.tech.includes(filter));

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
              className={
                activeButton === 'all'
                  ? 'btn btn-outlined sm active'
                  : 'btn btn-outlined sm'
              }
            >
              All
            </motion.button>
            {selectedTechs.map((tech) => (
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
