import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from "next/legacy/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import classes from './projectContent.module.scss';

// Refactored to extract the custom renderers outside the component to avoid re-creating the object on each render
const getCustomRenderers = (currentTheme) => ({
  code({ className, children }) {
    const language = className.split('-')[1];
    return (
      <SyntaxHighlighter
        showLineNumbers
        language={language}
        style={currentTheme === 'dark' ? atomDark : solarizedlight}
      >
        {children}
      </SyntaxHighlighter>
    );
  },
});

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

  const customRenderers = getCustomRenderers(currentTheme);

  // Refactored to extract the image rendering logic into a separate function
  const renderImage = (image) => {
    const isSpecialImage = image === 'portfolio.webp' || image === 'start-page.webp';
    const width = isSpecialImage ? 850 : 700;
    const height = isSpecialImage ? 500 : 480;

    return (
      <Image
        src={`/images/projects/${image}`}
        width={width}
        height={height}
        alt=''
        loading='eager'
      />
    );
  };

  return (
    <div className={classes.projectDetail}>
      <div className='container section mvh-100 projectDetail'>
        <Link href='/projects/' legacyBehavior>
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
                <i className='fas fa-link'></i>
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

          <ReactMarkdown
            components={customRenderers}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>

          {screenshots && (
            <div className={screenshots ? 'mb-50' : ''}>
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
                      alt={screenshot.description}
                      loading='eager'
                      objectFit='contain'
                    />
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

export default ProjectContent;
