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
  const { id, title, description, date, liveLink, slug } = blog;

  // Ensure the blog has a valid id before rendering
  if (!id) return null;

  const renderBlogLinks = (
    <div className={classes.blogLinks}>
      {liveLink && (
        <a href={liveLink} target='_blank' rel='noreferrer'>
          <i className='fa fa-arrow-up-right-from-square'></i>
          Website
        </a>
      )}
      <Link href={`/blog/${slug}`}>
        <i className='fa fa-arrow-up-right-from-square'></i>View Post
      </Link>
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
          <h4>{title}</h4>
          <p className={classes.written}><strong>Written</strong> {date}</p> {/* Displaying the date the blog post was written */}
        </div>
      </Link>
      <p>{description}</p>
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
    date: PropTypes.string.isRequired, // Added date prop type validation
    liveLink: PropTypes.string,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogItem;
