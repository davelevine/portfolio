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
        // Check if a is a legacy post with no expiration date
        const isALegacyWithoutExpiration = a.title.includes('(Legacy)') && !a.expirationDate;
        // Check if b is a legacy post with no expiration date
        const isBLegacyWithoutExpiration = b.title.includes('(Legacy)') && !b.expirationDate;

        if (isALegacyWithoutExpiration && !isBLegacyWithoutExpiration) {
          return 1; // Move a to the end
        } else if (!isALegacyWithoutExpiration && isBLegacyWithoutExpiration) {
          return -1; // Move b to the end
        } else {
          return b.isFeatured - a.isFeatured;
        }
      });
  } else {
    filteredPosts = posts
      .filter((post) => post.tech.includes(filter))
      .sort((a, b) => {
        const isALegacyWithoutExpiration = a.title.includes('(Legacy)') && !a.expirationDate;
        const isBLegacyWithoutExpiration = b.title.includes('(Legacy)') && !b.expirationDate;

        if (isALegacyWithoutExpiration && !isBLegacyWithoutExpiration) {
          return 1; // Move a to the end
        } else if (!isALegacyWithoutExpiration && isBLegacyWithoutExpiration) {
          return -1; // Move b to the end
        } else {
          return b.isFeatured - a.isFeatured;
        }
      });
  }

  return (
    <section className={classes.blog}>
      <div className={classes.container}>
        <h1>Certifications</h1>
        <div className={classes.filter}>
          <h3><p>Sort By:</p></h3>
          <div className={classes.filterButtons}>
            <motion.button
              whileHover={{ scale: 1.1 }}
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
                whileHover={{ scale: 1.1 }}
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
