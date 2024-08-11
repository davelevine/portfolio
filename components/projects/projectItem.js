import PropTypes from 'prop-types';
import classes from './projectItem.module.scss';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/**
 * ProjectItem component to display individual project details.
 * @param {object} props - The component props.
 * @param {object} props.project - The project data.
 * @returns {JSX.Element|null} - The rendered project item component or null if no valid id.
 */
const ProjectItem = ({ project }) => {
  const { id, title, tech, image, description, githubLink, liveLink, slug } = project;

  // Ensure the project has a valid id before rendering
  if (!id) return null;

  const isPriorityImage = image === 'atw.webp'; // Only 'atw.webp' is prioritized
  const imageSrc = `https://cdn.levine.io/uploads/portfolio/public/images/projects/${image}`;
  const techLogos = Array.isArray(tech) ? tech : [tech];

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ scale: 0.1 }}
      layout
      className={classes.card}
    >
      <Link href={`/projects/${slug}`} aria-label={`View details about ${title}`}>
        <div className={classes.cardContent}>
          <h4>{title}</h4>
          {image ? (
            <div className={classes.image}>
              <Image
                src={imageSrc}
                width={320}
                height={220}
                alt={image}
                style={{
                  width: "310px",
                  height: "210px",
                  objectFit: "contain"
                }}
                priority={isPriorityImage} // Use priority only for 'atw.webp'
                loading={isPriorityImage ? undefined : "lazy"} // Defer offscreen images
              />
            </div>
          ) : (
            <div className={classes.placeholderContainer}>
              <div className={classes.placeholder}>.</div>
            </div>
          )}
          <div className={classes.techLogos} style={{ marginTop: '1rem' }}>
            {techLogos.map((t) => (
              <img
                key={t}
                src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/logos/${t}.svg`}
                alt={t}
                className={classes.techLogo}
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'contain', margin: '0 10px' }} // Increased margin for spacing
              />
            ))}
          </div>
        </div>
      </Link>
      <p>{description}</p>
      <div className={classes.projectLinks}>
        {githubLink && (
          <a href={githubLink} target='_blank' rel='noreferrer' aria-label={`View ${title} on GitHub`}>
            <i className='fab fa-github'></i>
            Github
          </a>
        )}
        {liveLink && (
          <a href={liveLink} target='_blank' rel='noreferrer' aria-label={`View ${title} live`}>
            <i className='fa-regular fa-arrow-up-right-from-square'></i>
            Website
          </a>
        )}
        <Link href={`/projects/${slug}`} aria-label={`More details about ${title}`}>
          <i className='fa-regular fa-circle-info'></i>Details
        </Link>
      </div>
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
