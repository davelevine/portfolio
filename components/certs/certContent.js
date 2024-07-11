import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import classes from './certContent.module.scss';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CertContent = ({ cert, currentTheme }) => {
  const { content, slug, image } = cert || {};
  const imagePath = useMemo(() => `/images/certs/${slug}/${image}`, [slug, image]);

  // Memoized renderCode function
  const renderCode = useMemo(() => ({ className, children }) => {
    const language = className?.split('-')[1];
    const style = currentTheme === 'dark' ? atomDark : solarizedlight;

    return (
      <SyntaxHighlighter style={style} language={language} showLineNumbers>
        {children}
      </SyntaxHighlighter>
    );
  }, [currentTheme]);

  return (
    <div className={classes.certContent}>
      <div className={classes.container}>
        <article>
          <ReactMarkdown components={{ code: renderCode }}>{content}</ReactMarkdown>
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