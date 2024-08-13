import { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Keep this if you use GFM features like tables, strikethroughs, task lists, etc.
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Importing SyntaxHighlighter
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // Importing styles

import classes from './blogContent.module.scss';

const getCustomRenderers = (currentTheme) => ({
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={currentTheme === 'dark' ? atomDark : oneLight}
        language={match[1]}
        PreTag="div"
        showLineNumbers
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  blockquote({ node, children, ...props }) {
    return (
      <div className={classes.quoteBox}>
        <blockquote {...props}>
          {children}
        </blockquote>
      </div>
    );
  },
  img({ src, alt }) {
    return (
      <div className={classes.blogImage}>
        <Image
          src={src}
          alt={alt}
          width={700}
          height={450}
          className={classes.markdownImage}
          priority
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
    );
  },
});

const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={classes.spinner}
  />
);

const BlogContent = ({ blog, currentTheme, showModal = false }) => {
  const {
    content,
    githubLink,
    liveLink,
    title,
    categories,
    date,
    image,
  } = blog;

  const customRenderers = useMemo(() => getCustomRenderers(currentTheme), [currentTheme]);

  useEffect(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflow = showModal ? 'hidden' : 'auto';
    bodyStyle.paddingRight = '0px';
  }, [showModal]);

  const readingTime = Math.ceil(content.split(' ').length / 200);

  const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });

  return (
    <div className={classes.blogDetail}>
      <div className='container section mvh-100 blogDetail'>
        <div className={classes.card}>
          <h1>{title}</h1>
          <small>
            <span><i className="fa-regular fa-calendar-lines-pen" /> {formattedDate}</span>
            <span className={classes.dot}> • </span>
            <span><i className="fa-regular fa-clock" /> {readingTime} min</span>
            <br />
            <span><i className="fa-regular fa-tags" /> </span>
            {Array.isArray(categories) ? categories.map((category, index) => (
              <span key={index} className={classes.category}>
                {category}
                {index < categories.length - 1 && <span className={classes.dot}> • </span>}
              </span>
            )) : categories}
          </small>

          {image && (
            <div className={classes.blogImage}>
              <Image
                src={`https://cdn.levine.io/uploads/portfolio/public/images/blog/${image}`}
                width={700}
                height={450}
                alt={image}
                priority
                className={classes.blogMainImage}
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          )}

          <div className={classes.blogLinks}>
            {githubLink && (
              <a href={githubLink} target='_blank' rel='noreferrer'>
                <i className='fab fa-github'></i>
                Github
              </a>
            )}
            {liveLink && (
              <a href={liveLink} target='_blank' rel='noreferrer'>
                <i className='fa-regular fa-arrow-up-right-from-square'></i>
                Website
              </a>
            )}
          </div>

          <div className={classes.divider}></div>

          <ReactMarkdown
            components={customRenderers}
            remarkPlugins={[remarkGfm]} // Keep this if using GFM features
          >
            {content}
          </ReactMarkdown>

          <div className={classes.btnContainer}>
            <Link href='/blog/'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={classes.btnFilledBlog}
              >
                View All Posts
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogContent.propTypes = {
  blog: PropTypes.shape({
    content: PropTypes.string.isRequired,
    githubLink: PropTypes.string,
    liveLink: PropTypes.string,
    title: PropTypes.string.isRequired,
    categories: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    image: PropTypes.string,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  currentTheme: PropTypes.oneOf(['dark', 'light']).isRequired,
  showModal: PropTypes.bool,
};

export default BlogContent;
