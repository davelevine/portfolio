import classes from './projectItem.module.scss';
import Link from 'next/link';
import Image from "next/legacy/image";
import { motion } from 'framer-motion';

const ProjectItem = ({ project }) => {
  const { title, tech, image, description, githubLink, liveLink, slug } = project;

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
            <div className={classes.image}>
              <Image
                src={`/images/projects/${image}`}
                width={320}
                height={220}
                alt=''
                loading='eager'
              />
            </div>
          ) : (
            <div className={classes.placeholderContainer}>
              <div className={classes.placeholder}>.</div>
            </div>
          )}
        </div>
      </Link>

      <p>{description}</p>

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
    </motion.div>
  );
};

export default ProjectItem;
