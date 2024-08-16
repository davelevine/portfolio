import PropTypes from 'prop-types';
import classes from './projectItem.module.scss';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ProjectItem = ({ project }) => {
  const { id, title, tech, image, description, githubLink, liveLink, slug } = project;

  if (!id) return null;

  const imageSrc = `https://cdn.levine.io/uploads/portfolio/public/images/projects/${image}`;
  const techLogos = Array.isArray(tech) ? tech : [tech];

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ scale: 0.1 }}
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
                alt={`Visual representation of the project titled "${title}"`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "contain"
                }}
                priority={true} // Priority for LCP image
                loading={imageSrc === `https://cdn.levine.io/uploads/portfolio/public/images/projects/${image}` ? undefined : 'lazy'}
              />
            </div>
          ) : (
            <div className={classes.placeholderContainer}>
              <div className={classes.placeholder}>.</div>
            </div>
          )}
          <div className={classes.techLogos}>
            {techLogos.map((t) => (
              <div key={t} className={classes.techLogo}>
                <Image
                  src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/logos/${t}.svg`}
                  alt={`${t} logo`}
                  width={24}
                  height={24}
                  loading="lazy" // Lazy load for non-LCP tech logos
                />
              </div>
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
