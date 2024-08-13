import PropTypes from 'prop-types';
import classes from './blogItem.module.scss';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

/**
 * Dynamically import the Link component for code splitting
 */
const Link = dynamic(() => import('next/link'), {
  loading: () => <div className="skeleton-loader"></div>,
});

/**
 * BlogItem component to display individual blog details.
 * @param {object} props - The component props.
 * @param {object} props.blog - The blog data.
 * @returns {JSX.Element|null} - The rendered blog item component or null if no valid id.
 */
const BlogItem = ({ blog }) => {
  const { id, title, description, date, liveLink, slug, readingTime } = blog;

  // Ensure the blog has a valid id before rendering
  if (!id) return null;

  const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });

  const renderBlogLinks = (
    <div className={classes.blogLinks}>
      <Link href={`/blog/${slug}`}>
        <i className='fa-regular fa-arrow-up-right-from-square'></i>View Post
      </Link>
      {liveLink && (
        <a href={liveLink} target='_blank' rel='noreferrer'>
          <i className='fa-regular fa-arrow-up-right-from-square'></i> Website
        </a>
      )}
    </div>
  );

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ scale: 0.1 }}
      layout
      className={classes.card}
    >
      <Link href={`/blog/${slug}`}>
        <div className={classes.cardContent}>
          <h4 className={classes.title}>{title}</h4>
          <p className={classes.description}>{description}</p>
        </div>
      </Link>
      <div className={classes.metaInfo}>
        <div className={classes.metaItem}>
          <i className='fa-regular fa-calendar-lines-pen'></i>
          <p className={classes.date}>{formattedDate}</p>
        </div>
        <div className={classes.metaItem}>
          <i className='fa-regular fa-clock'></i>
          <p className={classes.readingTime}>{readingTime} minute{readingTime !== 1 ? 's' : ''}</p>
        </div>
      </div>
      {renderBlogLinks}
    </motion.div>
  );
};

BlogItem.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    liveLink: PropTypes.string,
    slug: PropTypes.string.isRequired,
    readingTime: PropTypes.number.isRequired,
  }).isRequired,
};

export default BlogItem;
