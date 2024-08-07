import PropTypes from 'prop-types';
import classes from './projectItem.module.scss';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Image from 'next/image';

// Dynamically import the Link component for code splitting
const Link = dynamic(() => import('next/link'), {
  loading: () => <div className="skeleton-loader"></div>,
});

/**
 * Custom hook for memoized image rendering logic.
 * @param {string} image - The image filename.
 * @returns {JSX.Element} - The rendered image component.
 */
const useRenderImage = (image) => {
  return useMemo(() => {
    const isPriorityImage = ['atw.webp', 'atomic-url.webp'].includes(image);
    return (
      <div className={classes.image}>
        <Image
          src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/${image}`}
          width={320}
          height={220}
          alt={image}
          style={{
            width: "310px",
            height: "210px",
            objectFit: "contain"
          }}
          priority={isPriorityImage}
          loading={isPriorityImage ? undefined : "lazy"}
        />
      </div>
    );
  }, [image]);
};

/**
 * Custom hook for memoized project link rendering logic.
 * @param {string} githubLink - The GitHub link.
 * @param {string} liveLink - The live project link.
 * @param {string} slug - The project slug.
 * @returns {JSX.Element} - The rendered project links component.
 */
const useRenderProjectLinks = (githubLink, liveLink, slug) => {
  return useMemo(() => (
    <div className={classes.projectLinks}>
      {githubLink && (
        <a href={githubLink} target='_blank' rel='noreferrer'>
          <i className='fab fa-github'></i>
          Github
        </a>
      )}
      {liveLink && (
        <a href={liveLink} target='_blank' rel='noreferrer'>
          <i className='fa-regular fa-arrow-up-right-from-square'></i>
          Website
        </a>
      )}
      <Link href={`/projects/${slug}`}>
        <i className='fa-regular fa-circle-info'></i>Details
      </Link>
    </div>
  ), [githubLink, liveLink, slug]);
};

/**
 * Custom hook for rendering tech logos.
 * @param {Array} tech - The tech array.
 * @returns {JSX.Element} - The rendered tech logos component.
 */
const useRenderTechLogos = (tech) => {
  return useMemo(() => (
    <div className={classes.techLogos} style={{ marginTop: '1rem' }}> {/* Added marginTop for spacing */}
      {Array.isArray(tech) ? tech.map((t) => (
        <img
          key={t}
          src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/logos/${t}.svg`}
          alt={t}
          className={classes.techLogo}
          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'contain', margin: '0 10px' }} // Increased margin for spacing
        />
      )) : (
        <img
          src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/logos/${tech}.svg`}
          alt={tech}
          className={classes.techLogo}
          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'contain', margin: '0 10px' }} // Increased margin for spacing
        />
      )}
    </div>
  ), [tech]);
};

/**
 * ProjectItem component to display individual project details.
 * @param {object} props - The component props.
 * @param {object} props.project - The project data.
 * @returns {JSX.Element|null} - The rendered project item component or null if no valid id.
 */
const ProjectItem = ({ project }) => {
  const { id, title, tech, image, description, githubLink, liveLink, slug } = project;

  const renderImage = useRenderImage(image);
  const renderProjectLinks = useRenderProjectLinks(githubLink, liveLink, slug);
  const renderTechLogos = useRenderTechLogos(tech);

  // Ensure the project has a valid id before rendering
  if (!id) return null;

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
          {image ? renderImage : (
            <div className={classes.placeholderContainer}>
              <div className={classes.placeholder}>.</div>
            </div>
          )}
          {renderTechLogos}
        </div>
      </Link>
      <p>{description}</p>
      {renderProjectLinks}
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
