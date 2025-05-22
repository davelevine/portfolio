import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './blog.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import BlogItem from './blogItem';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import Modal with improved loading
const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader" aria-label="Loading contact form..."></div>,
  ssr: false,
});

// Animation variants for consistent use
const buttonVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

const headerVariants = {
  hidden: { opacity: 0, x: -600 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

const subheaderVariants = {
  hidden: { opacity: 0, x: 300 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// Blog item component with animation - fixed to maintain uniform box sizing
const BlogItemWithAnimation = ({ blog }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.5 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.5 }}
      exit={{ opacity: 0, y: -100, scale: 0.5 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ display: 'grid' }} // Restored to maintain uniform box sizing
      className={classes.blogItemContainer} // Add a class for additional styling if needed
    >
      <BlogItem blog={blog} lazyLoad={true} />
    </motion.div>
  );
};

BlogItemWithAnimation.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    isFeatured: PropTypes.bool.isRequired,
  }).isRequired,
};

const Blog = ({ blog }) => {
  const [filterState, setFilterState] = useState({ 
    category: 'all', 
    activeButton: 'all' 
  });
  const [modalState, setModalState] = useState({ 
    show: false, 
    type: '' 
  });

  // Ensure blog items are valid
  const validBlog = useMemo(() => 
    blog.filter(item => 
      item?.id && 
      item?.description && 
      Array.isArray(item?.categories) && 
      typeof item?.isFeatured === 'boolean'
    ),
    [blog]
  );

  // Extract unique categories
  const selectedCategories = useMemo(() => {
    const categoriesSet = new Set();
    validBlog.forEach(({ categories }) => {
      categories.forEach(category => categoriesSet.add(category));
    });
    return Array.from(categoriesSet).sort();
  }, [validBlog]);

  // Filter blogs based on selected category
  const filteredBlog = useMemo(() => {
    return filterState.category === 'all'
      ? [...validBlog].sort((a, b) => (b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1))
      : validBlog.filter(({ categories }) => categories.includes(filterState.category));
  }, [filterState.category, validBlog]);

  // Handle filter button click
  const handleFilterClick = useCallback((category) => {
    setFilterState({
      category,
      activeButton: category
    });
  }, []);

  // Handle modal close
  const closeModalHandler = useCallback(() => {
    setModalState({ show: false, type: '' });
  }, []);

  // Create a throttled scroll handler for the progress bar
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      const scrollProgress =
        (document.documentElement.scrollTop /
          (document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
        100;
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) progressBar.style.width = `${scrollProgress}%`;
    });
  }, []);

  // Setup scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Handle body overflow when modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = modalState.show ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [modalState.show]);

  return (
    <>
      <Head>
        <title>Blog | Dave Levine - Solutions Engineer</title>
        <meta name="description" content="Read Dave Levine's latest thoughts on solutions engineering, web development, and technology." />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed for Dave Levine's Blog" href="/rss.xml" />
      </Head>

      <section className={classes.blogGallery}>
        <div id="scroll-progress" className={classes.scrollProgress}></div>

        <div className={classes.container}>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            BLOG
          </motion.h1>

          <div className={classes.filter}>
            <motion.h3
              initial="hidden"
              animate="visible"
              variants={subheaderVariants}
            >
              <p>Sort By Category</p>
            </motion.h3>

            <motion.div
              className={classes.filterButtons}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterClick('all')}
                className={`btn btn-outlined sm ${filterState.activeButton === 'all' ? 'active' : ''}`}
                variants={buttonVariants}
              >
                All
              </motion.button>

              {selectedCategories.map((category) => (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterClick(category)}
                  className={`btn btn-outlined sm ${filterState.activeButton === category ? 'active' : ''}`}
                  key={category}
                  variants={buttonVariants}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div className={classes.galleryWrap}>
            <div className={classes.gallery}>
              {filteredBlog.map((blog) => (
                <BlogItemWithAnimation key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {modalState.show && (
            <Modal 
              contact={modalState.type === 'contact'} 
              onClose={closeModalHandler} 
            />
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

Blog.propTypes = {
  blog: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      isFeatured: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default Blog;
