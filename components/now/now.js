import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import classes from './now.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
  ssr: false,
});

const getInitialTheme = (defaultTheme = 'dark') => {
  if (typeof globalThis.window === 'object') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return defaultTheme; // Use the provided default theme for SSR
};

const Now = ({ markdownContent, showModal = false }) => {
  const hasAnimated = useRef(false);
  const theme = useMemo(() => getInitialTheme(), []);

  const getCustomRenderers = useMemo(() => ({
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <pre className={className} {...props}>
          <code>{String(children).replace(/\n$/, '')}</code>
        </pre>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ children, ...props }) => (
      <div className={classes.quoteBox}>
        <blockquote {...props}>{children}</blockquote>
      </div>
    ),
    hr: () => <hr className={classes.divider} />,
    strong: ({ children }) => <strong className={classes.highlighted}>{children}</strong>,
    a: ({ href, children }) => (
      <a href={href} className={classes.link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    img: ({ src, alt, ...props }) => {
      const isLCPImage = src === "https://cdn.levine.io/uploads/portfolio/public/images/home-office.webp";
      return (
        <Image
          src={src}
          alt={alt}
          className={classes.nowImage}
          width={1536}
          height={720}
          priority={isLCPImage} // Use priority if this is the LCP image
          loading={isLCPImage ? undefined : "lazy"} // Remove lazy loading if priority is used
          {...props}
        />
      );
    },
  }), []);

  // Extract the date from the @now.md front matter
  const nowDateMatch = markdownContent.match(/date:\s*"([^"]+)"/);
  const nowDate = nowDateMatch ? new Date(nowDateMatch[1]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown Date';

  // Remove the date from the markdown content to prevent it from showing up as text
  const contentWithoutDate = markdownContent.replace(/date:\s*"[^"]+"/, '');

  // Calculate word count
  const wordCount = contentWithoutDate.split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (typeof globalThis.window === 'object') {
      document.title = 'Dave Levine - Now';
      document.body.style.overflow = showModal ? 'hidden' : 'auto';
      document.body.style.paddingRight = showModal ? '15px' : '0px';

      if (theme) {
        document.body.className = theme;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      const handleThemeChange = (e) => {
        document.body.className = e.matches ? 'light' : 'dark';
      };
      mediaQuery.addEventListener('change', handleThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleThemeChange);
      };
    }
  }, [showModal, theme]);

  return (
    <div className={classes.now}>
      <div className="container section mvh-100">
        <div className={classes.card}>
          <motion.h1
            initial={hasAnimated.current ? {} : { opacity: 0, x: -600 }}
            animate={hasAnimated.current ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={classes.title}
            onAnimationComplete={() => {
              hasAnimated.current = true;
            }}
          >
            Here and Now
          </motion.h1>
          <div className={classes.metaInfo}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.2 }}
              className={classes.inlineMeta}
            >
              <span className={classes.inlineItem}>
                <i className="fa-regular fa-calendar-lines-pen" /> {nowDate} &nbsp;•&nbsp; <i className="fa-regular fa-font" /> {wordCount} words
              </span>
              <span className={classes.inlineItem}>
                <i className="fa-regular fa-tags" /> Personal &nbsp;•&nbsp; Professional
              </span>
            </motion.span>
          </div>
          <hr className={classes.divider} />
          <ReactMarkdown components={getCustomRenderers} remarkPlugins={[remarkGfm]}>
            {contentWithoutDate}
          </ReactMarkdown>
        </div>
      </div>
      {showModal && <Modal />}
    </div>
  );
};

Now.propTypes = {
  markdownContent: PropTypes.string.isRequired,
  showModal: PropTypes.bool,
};

export default Now;
