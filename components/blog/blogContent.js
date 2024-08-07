import { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import rehypeRaw from 'rehype-raw';
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import classes from './blogContent.module.scss';

/**
 * Get custom renderers for ReactMarkdown based on the current theme.
 * @param {string} currentTheme - The current theme ('dark' or 'light').
 * @returns {object} Custom renderers for ReactMarkdown.
 */
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
});

/**
 * Spinner component for loading fallback.
 * @returns {JSX.Element} The rendered Spinner component.
 */
const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={classes.spinner}
  />
);

/**
 * Render an image with specific dimensions based on the image name.
 * @param {string} imageName - The image file name.
 * @returns {JSX.Element} The rendered Image component.
 */
const renderImage = (imageName) => {
  const isSpecialImage = ['portfolio.webp', 'start-page.webp'].includes(imageName);
  const dimensions = isSpecialImage ? { width: 850, height: 500 } : { width: 700, height: 450 };

  return (
    <div className={classes.blogImage}>
      <Image
        src={`https://cdn.levine.io/uploads/portfolio/public/images/blog/${imageName}`}
        width={850} // Updated to match projectContent.js
        height={500} // Updated to match projectContent.js
        alt={imageName}
        priority
        style={{
          maxWidth: "100%",
          height: "auto",
          aspectRatio: `850 / 500` // Updated to match projectContent.js
        }}
      />
    </div>
  );
};

/**
 * BlogContent component to display blog details.
 * @param {object} props - The component props.
 * @param {object} props.blog - The blog data.
 * @param {string} props.currentTheme - The current theme ('dark' or 'light').
 * @param {boolean} props.showModal - Indicates if a modal is shown.
 * @returns {JSX.Element} The rendered BlogContent component.
 */
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

  // Prevent vertical scrollbar when modal is opened
  useEffect(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflow = showModal ? 'hidden' : 'auto';
    bodyStyle.paddingRight = '0px';
  }, [showModal]);

  // Calculate reading time based on content length
  const readingTime = Math.ceil(content.split(' ').length / 200); // Assuming average reading speed of 200 words per minute

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={classes.blogDetail}>
      <div className='container section mvh-100 blogDetail'>
        <div className={classes.card}>
          <h1>{title}</h1>
          <small>
            <span><i className="fa-regular fa-calendar" /> {formattedDate}</span>
            <span className={classes.dot}> • </span>
            <span><i className="fa-regular fa-clock" /> {readingTime} min</span>
            <br />
            <span>Categories: </span> {Array.isArray(categories) ? categories.join(', ') : categories}
          </small>

          {image && (
            <div className={classes.blogImage}>
              {renderImage(image)}
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
                <i className='fa fa-arrow-up-right-from-square'></i>
                Website
              </a>
            )}
          </div>

          <div className={classes.divider}></div>

          <ReactMarkdown
            components={customRenderers}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
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
