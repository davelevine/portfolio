import { useMemo, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import rehypeRaw from 'rehype-raw';
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import classes from './projectContent.module.scss';

// Lazy load components for code splitting
const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(mod => mod.Prism));
const atomDark = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.atomDark));
const solarizedlight = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.solarizedlight));

/**
 * Get custom renderers for ReactMarkdown based on the current theme.
 * @param {string} currentTheme - The current theme ('dark' or 'light').
 * @returns {object} Custom renderers for ReactMarkdown.
 */
const getCustomRenderers = (currentTheme) => ({
  code({ className, children }) {
    const language = className?.split('-')[1];
    return (
      <Suspense fallback={<div>Loading...</div>}>
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
 * @param {string} image - The image file name.
 * @returns {JSX.Element} The rendered Image component.
 */
const renderImage = (image) => {
  const isSpecialImage = ['portfolio.webp', 'start-page.webp'].includes(image);
  const dimensions = isSpecialImage ? { width: 850, height: 500 } : { width: 700, height: 450 };

  return (
    <Image
      src={`/images/projects/${image}`}
      width={dimensions.width}
      height={dimensions.height}
      alt=''
      priority
      style={{
        maxWidth: "100%",
        height: "auto",
        aspectRatio: `${dimensions.width} / ${dimensions.height}`
      }} />
  );
};

/**
 * ProjectContent component to display project details.
 * @param {object} props - The component props.
 * @param {object} props.project - The project data.
 * @param {string} props.currentTheme - The current theme ('dark' or 'light').
 * @returns {JSX.Element} The rendered ProjectContent component.
 */
const ProjectContent = ({ project, currentTheme }) => {
  const {
    content,
    githubLink,
    liveLink,
    title,
    tech,
    image,
    screenshots,
    slug,
  } = project;

  const customRenderers = useMemo(() => getCustomRenderers(currentTheme), [currentTheme]);

  return (
    <div className={classes.projectDetail}>
      <div className='container section mvh-100 projectDetail'>
        <Link href='/projects/'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='btn btn-filled-project'
          >
            View All Projects
          </motion.button>
        </Link>

        <div className={classes.card}>
          <div className={classes.projectLinks}>
            {githubLink && (
              <a href={githubLink} target='_blank' rel='noreferrer'>
                <i className='fab fa-github'></i>
                Github
              </a>
            )}
            {liveLink && (
              <a href={liveLink} target='_blank' rel='noreferrer'>
                <i className='fa fa-link'></i>
                Website
              </a>
            )}
          </div>

          <h1>{title}</h1>
          <small>{Array.isArray(tech) ? tech.join(', ') : tech}</small>

          {image && (
            <div className={classes.projectImage}>
              {renderImage(image)}
            </div>
          )}

          <Suspense fallback={<div>Loading...</div>}>
            <ReactMarkdown
              components={customRenderers}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </Suspense>

          {screenshots && screenshots.length > 0 && (
            <div className='mb-50'>
              <h2>Screenshots</h2>
              <Swiper
                rewind={true}
                grabCursor={true}
                modules={[Navigation]}
                navigation={true}
                className='mySwiper'
              >
                {screenshots.map((screenshot, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={`/images/projects/${slug}/${screenshot.screenshot}`}
                      width={1000}
                      height={700}
                      alt={screenshot.description || 'Screenshot'}
                      priority
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain",
                        aspectRatio: "1000 / 700"
                      }} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
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
    screenshots: PropTypes.arrayOf(PropTypes.shape({
      screenshot: PropTypes.string.isRequired,
      description: PropTypes.string,
    })),
    slug: PropTypes.string.isRequired,
  }).isRequired,
  currentTheme: PropTypes.oneOf(['dark', 'light']).isRequired,
};

export default ProjectContent;