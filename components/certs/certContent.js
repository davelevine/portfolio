import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import classes from './certContent.module.scss';
import { motion } from 'framer-motion';

const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(mod => mod.Prism));
const atomDark = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.atomDark));
const solarizedlight = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.solarizedlight));

/**
 * CertContent component renders the content of a certification.
 * It uses ReactMarkdown to parse markdown content and SyntaxHighlighter for code blocks.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.cert - Certification data.
 * @param {string} props.cert.content - Markdown content of the certification.
 * @param {string} props.cert.slug - Slug for the certification.
 * @param {string} props.cert.image - Image filename for the certification.
 * @param {string} props.currentTheme - Current theme, either 'dark' or 'light'.
 * @returns {JSX.Element} The rendered component.
 */
const CertContent = ({ cert, currentTheme }) => {
  const { content } = cert || {};

  /**
   * Renders code blocks with syntax highlighting.
   *
   * @param {Object} props - Properties for the code block.
   * @param {string} props.className - Class name containing the language.
   * @param {string} props.children - Code content.
   * @returns {JSX.Element} The rendered code block.
   */
  const renderCode = ({ className, children }) => {
    const language = className?.split('-')[1];
    const style = currentTheme === 'dark' ? atomDark : solarizedlight;

    return (
      <Suspense fallback={
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={classes.spinner}
        />
      }>
        <SyntaxHighlighter style={style} language={language} showLineNumbers>
          {children}
        </SyntaxHighlighter>
      </Suspense>
    );
  };

  return (
    <div className={classes.certContent}>
      <div className={classes.container}>
        <article>
          <Suspense fallback={
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={classes.spinner}
            />
          }>
            <ReactMarkdown components={{ code: renderCode }}>{content}</ReactMarkdown>
          </Suspense>
        </article>
      </div>
    </div>
  );
};

CertContent.propTypes = {
  cert: PropTypes.shape({
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  currentTheme: PropTypes.oneOf(['dark', 'light']).isRequired,
};

export default CertContent;