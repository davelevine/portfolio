import PropTypes from 'prop-types';
import classes from './projectItem.module.scss';
import Link from 'next/link';
import Image from "next/image";
import { motion } from 'framer-motion';

// Extracted image rendering logic into a separate function
const renderImage = (image) => (
  <div className={classes.image}>
    <Image
      src={`/images/projects/${image}`}
      width={320}
      height={220}
      alt=''
      loading='eager'
      // Added priority attribute for LCP
      priority
      style={{
        width: "310px", // Set fixed width
        height: "210px", // Set fixed height
        objectFit: "contain" // Ensure the image covers the container
      }} />
  </div>
);

// Extracted project link rendering logic into a separate function
const renderProjectLinks = (githubLink, liveLink, slug) => (
  <div className={classes.projectLinks}>
    {githubLink && (
      <a href={githubLink} target='_blank' rel='noreferrer'>
        <i className='fab fa-github'></i>
        Github
      </a>
    )}
    {liveLink && (
      <a href={liveLink} target='_blank' rel='noreferrer'>
        <i className='fas fa-link'></i>
        Website
      </a>
    )}
    <Link href={`/projects/${slug}`}>
      <i className='fa fa-circle-info'></i>Details
    </Link>
  </div>
);

const ProjectItem = ({ project }) => {
  const { id, title, tech, image, description, githubLink, liveLink, slug } = project;

  // Ensure the project has a valid id before rendering
  if (!id) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ scale: 0.1 }}
      layout
      className={classes.card}
    >
      <Link href={`/projects/${slug}`}>
        <div className={classes.cardContent}>
          <h4>{title}</h4>
          <small className='mb-10 d-block'>
            {Array.isArray(tech) ? tech.join(', ') : tech}
          </small>

          {image ? (
            renderImage(image)
          ) : (
            <div className={classes.placeholderContainer}>
              <div className={classes.placeholder}>.</div>
            </div>
          )}
        </div>
      </Link>

      <p>{description}</p>

      {renderProjectLinks(githubLink, liveLink, slug)}
    </motion.div>
  );
};

ProjectItem.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tech: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    image: PropTypes.string,
    description: PropTypes.string.isRequired,
    githubLink: PropTypes.string,
    liveLink: PropTypes.string,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProjectItem;