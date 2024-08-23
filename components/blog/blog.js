import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classes from './blog.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import BlogItem from './blogItem';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import Head from 'next/head'; // Import Head component

// Dynamically import the Modal component for code splitting
const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

// Throttle function to optimize scroll events
const throttle = (fn, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Define buttonVariants for motion effects on buttons
const buttonVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// Component to animate blog items when they come into view
const BlogItemWithAnimation = ({ blog }) => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Set to true to avoid re-triggering the animation
    threshold: 0.1, // Trigger when 10% of the item is visible
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.5 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.5 }}
      exit={{ opacity: 0, y: -100, scale: 0.5 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ display: 'grid' }}
    >
      <BlogItem blog={blog} lazyLoad={inView} />
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
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Ensure that each blog has an id, description, categories, and isFeatured before proceeding
  const validBlog = useMemo(
    () => blog.filter((item) => item.id && item.description && item.categories && item.isFeatured !== null),
    [blog]
  );

  // Memoize selectedCategories using Set directly
  const selectedCategories = useMemo(() => {
    const categoriesSet = new Set();
    validBlog.forEach(({ categories }) => {
      if (Array.isArray(categories)) {
        categories.forEach((category) => categoriesSet.add(category));
      }
    });
    return Array.from(categoriesSet).sort();
  }, [validBlog]);

  // Set document title on mount
  useEffect(() => {
    document.title = 'Dave Levine - Blog';
  }, []);

  // Handle button click to set filter and active button
  const handleFilterClick = (category) => {
    setFilter(category);
    setActiveButton(category);
  };

  // Function to close the modal
  const closeModalHandler = () => {
    setShowModal(false);
    setModalType('');
  };

  // Manage body overflow when the modal is open or closed
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
    document.body.style.paddingRight = showModal ? '15px' : '0px';
  }, [showModal]);

  // Filter blog based on selected category
  const filteredBlog = useMemo(() => {
    return filter === 'all'
      ? validBlog.sort((a, b) => b.isFeatured - a.isFeatured)
      : validBlog.filter(({ categories }) => categories.includes(filter));
  }, [filter, validBlog]);

  const handleScroll = throttle(() => {
    const scrollProgress =
      (document.documentElement.scrollTop /
        (document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
      100;
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) progressBar.style.width = `${scrollProgress}%`;
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Initial call to set the progress bar width
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); // Added handleScroll as a dependency

  // Function to lazy load images with throttling
  const lazyLoadImages = throttle(() => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      if (img.getBoundingClientRect().top < window.innerHeight) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }, 200);

  useEffect(() => {
    const handleWindowLoad = () => {
      lazyLoadImages();
      window.addEventListener('scroll', lazyLoadImages);
    };

    window.addEventListener('load', handleWindowLoad);
    return () => {
      window.removeEventListener('load', handleWindowLoad);
      window.removeEventListener('scroll', lazyLoadImages);
    };
  }, [lazyLoadImages]); // Added lazyLoadImages as a dependency

  return (
    <>
      <Head>
        <link rel="alternate" type="application/rss+xml" title="RSS Feed for Dave Levine's Blog" href="/rss" />
      </Head>
      <section className={classes.blogGallery}>
        <div id="scroll-progress" className={classes.scrollProgress}></div>
        <div className={classes.container}>
          <motion.h1
            initial={{ opacity: 0, x: -600 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            BLOG
          </motion.h1>
          <div className={classes.filter}>
            <motion.h3
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <p>Sort By Category</p>
            </motion.h3>
            <motion.div
              className={classes.filterButtons}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, x: 100 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    staggerChildren: 0.05,
                    duration: 0.3,
                    ease: 'easeInOut',
                  },
                },
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterClick('all')}
                className={`btn btn-outlined sm ${activeButton === 'all' ? 'active' : ''}`}
                variants={buttonVariants}
              >
                All
              </motion.button>
              {selectedCategories.map((category) => (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterClick(category)}
                  className={`btn btn-outlined sm ${activeButton === category ? 'active' : ''}`}
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
        <AnimatePresence>{showModal && <Modal contact={modalType === 'contact'} onClose={closeModalHandler} />}</AnimatePresence>
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
