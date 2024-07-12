import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import classes from './certContent.module.scss';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
  const { content, slug, image } = cert || {};
  const imagePath = `/images/certs/${slug}/${image}`;

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
      <SyntaxHighlighter style={style} language={language} showLineNumbers>
        {children}
      </SyntaxHighlighter>
    );
  };

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