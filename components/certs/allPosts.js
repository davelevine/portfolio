import classes from './allPosts.module.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostItem from './postItem';

const AllPosts = (props) => {
  const { posts } = props;
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');

  const selectedPosts = [];

  posts.map((post) => {
    const techs = post.tech;

    if (Array.isArray(techs)) {
      for (const tech of techs) {
        if (!selectedPosts.includes(tech)) selectedPosts.push(tech);
      }
    }
  });

  selectedPosts.sort();

  const handleClick = (tech) => {
    setFilter(tech);
    setActiveButton(tech);
  };

  let filteredPosts;

  if (filter === 'all') {
    filteredPosts = posts
      .slice()
      .sort((a, b) => {
        // Check if a is a legacy post
        const isALegacy = a.title.includes('(Legacy)');
        // Check if b is a legacy post
        const isBLegacy = b.title.includes('(Legacy)');

        if (isALegacy && isBLegacy) {
          // Sort alphabetically if both are legacy
          return a.title.localeCompare(b.title);
        } else if (isALegacy) {
          return 1; // Move legacy post to the end
        } else if (isBLegacy) {
          return -1; // Move legacy post to the beginning
        } else {
          // Check if a and b have expiration dates
          const hasExpirationDateA = a.expirationDate;
          const hasExpirationDateB = b.expirationDate;

          if (hasExpirationDateA && hasExpirationDateB) {
            // Sort by expiration date
            return a.expirationDate.localeCompare(b.expirationDate);
          } else if (hasExpirationDateA) {
            return -1; // Move post with an expiration date to the beginning
          } else if (hasExpirationDateB) {
            return 1; // Move post with an expiration date to the end
          } else {
            return b.isFeatured - a.isFeatured;
          }
        }
      });
  } else {
    filteredPosts = posts
      .filter((post) => post.tech.includes(filter))
      .sort((a, b) => {
        const isALegacy = a.title.includes('(Legacy)');
        const isBLegacy = b.title.includes('(Legacy)');

        if (isALegacy && isBLegacy) {
          return a.title.localeCompare(b.title);
        } else if (isALegacy) {
          return 1;
        } else if (isBLegacy) {
          return -1;
        } else {
          const hasExpirationDateA = a.expirationDate;
          const hasExpirationDateB = b.expirationDate;

          if (hasExpirationDateA && hasExpirationDateB) {
            return a.expirationDate.localeCompare(b.expirationDate);
          } else if (hasExpirationDateA) {
            return -1;
          } else if (hasExpirationDateB) {
            return 1;
          } else {
            return b.isFeatured - a.isFeatured;
          }
        }
      });
  }

  return (
    <section className={classes.blog}>
      <div className={classes.container}>
        <h1>CERTIFICATIONS</h1>
        <div className={classes.filter}>
          <h3><p>Sort By Topic:</p></h3>
          <div className={classes.filterButtons}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick('all')}
              className={
                activeButton === 'all'
                  ? 'btn btn-outlined sm active'
                  : 'btn btn-outlined sm'
              }>
              All
            </motion.button>
            {selectedPosts.map((tech) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleClick(tech)}
                className={
                  activeButton === tech
                    ? 'btn btn-outlined sm active'
                    : 'btn btn-outlined sm'
                }
                key={tech}>
                {tech}
              </motion.button>
            ))}
          </div>
        </div>

        <div className={classes.galleryWrap}>
          <div className={classes.gallery}>
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <PostItem post={post} key={post.slug} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllPosts;
