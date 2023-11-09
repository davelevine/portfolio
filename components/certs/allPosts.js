import classes from './allPosts.module.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostItem from './postItem';

const AllPosts = ({ posts }) => {
  const [filter, setFilter] = useState('all');
  const [activeButton, setActiveButton] = useState('all');

  const selectedPosts = new Set();

  posts.forEach((post) => {
    const techs = post.tech;
    if (Array.isArray(techs)) {
      techs.forEach((tech) => {
        selectedPosts.add(tech);
      });
    }
  });

  const sortedUniqueTechs = [...selectedPosts].sort();

  const handleClick = (tech) => {
    setFilter(tech);
    setActiveButton(tech);
  };

  const commonSortLogic = (a, b) => {
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
  };

  const filteredPosts = filter === 'all'
    ? posts.slice().sort(commonSortLogic)
    : posts.filter((post) => post.tech.includes(filter)).sort(commonSortLogic);

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
            {sortedUniqueTechs.map((tech) => (
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
