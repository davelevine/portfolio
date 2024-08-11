import { useMemo, lazy, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import rehypeRaw from 'rehype-raw';
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';

import classes from './projectContent.module.scss';

// Lazy load components for code splitting where it makes sense
const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(mod => mod.Prism));
const atomDark = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.atomDark));
const solarizedlight = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.solarizedlight));

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
 * Get custom renderers for ReactMarkdown based on the current theme.
 * @param {string} currentTheme - The current theme ('dark' or 'light').
 * @returns {object} Custom renderers for ReactMarkdown.
 */
const getCustomRenderers = (currentTheme) => ({
  code({ className, children }) {
    const language = className?.split('-')[1];
    return (
      <Suspense fallback={<Spinner />}>
        <SyntaxHighlighter
          showLineNumbers
          language={language}
          style={currentTheme === 'dark' ? atomDark : solarizedlight}
        >
          {children}
        </SyntaxHighlighter>
      </Suspense>
    );
  },
});

/**
 * Render an image with specific dimensions based on the image name.
 * @param {string} imageName - The image file name.
 * @returns {JSX.Element} The rendered Image component.
 */
const renderImage = (imageName) => {
  const isSpecialImage = ['portfolio.webp', 'start-page.webp'].includes(imageName);
  const dimensions = isSpecialImage ? { width: 850, height: 500 } : { width: 700, height: 450 };

  return (
    <Image
      src={`https://cdn.levine.io/uploads/portfolio/public/images/projects/${imageName}`}
      width={dimensions.width}
      height={dimensions.height}
      alt={imageName}
      priority
      style={{
        maxWidth: "100%",
        height: "auto",
        aspectRatio: `${dimensions.width} / ${dimensions.height}`,
      }}
    />
  );
};

/**
 * ProjectContent component to display project details.
 * @param {object} props - The component props.
 * @param {object} props.project - The project data.
 * @param {string} props.currentTheme - The current theme ('dark' or 'light').
 * @param {boolean} props.showModal - Indicates if a modal is shown.
 * @returns {JSX.Element} The rendered ProjectContent component.
 */
const ProjectContent = ({ project, currentTheme, showModal = false }) => {
  const {
    content,
    githubLink,
    liveLink,
    title,
    tech,
    image,
  } = project;

  const customRenderers = useMemo(() => getCustomRenderers(currentTheme), [currentTheme]);

  // Prevent vertical scrollbar when modal is opened
  useEffect(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflow = showModal ? 'hidden' : 'auto';
    bodyStyle.paddingRight = showModal ? '0px' : '0px'; // Adjust padding for modal
  }, [showModal]);

  return (
    <div className={classes.projectDetail}>
      <div className='container section mvh-100 projectDetail'>
        <div className={classes.card}>
          <h1>{title}</h1>
          <small>{Array.isArray(tech) ? tech.join(', ') : tech}</small>

          {image && (
            <div className={classes.projectImage}>
              {renderImage(image)}
            </div>
          )}

          <div className={classes.projectLinks}>
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

          <Suspense fallback={<Spinner />}>
            <ReactMarkdown
              components={customRenderers}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </Suspense>

          <div className={classes.btnContainer}>
            <Link href='/projects/'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={classes.btnFilledProject} // Apply the SCSS class
              >
                View All Projects
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectContent.propTypes = {
  project: PropTypes.shape({
    content: PropTypes.string.isRequired,
    githubLink: PropTypes.string,
    liveLink: PropTypes.string,
    title: PropTypes.string.isRequired,
    tech: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    image: PropTypes.string,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  currentTheme: PropTypes.oneOf(['dark', 'light']).isRequired,
  showModal: PropTypes.bool,
};

export default ProjectContent;
