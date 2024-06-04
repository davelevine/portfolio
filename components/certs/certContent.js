import ReactMarkdown from 'react-markdown';
import classes from './certContent.module.scss';
import Image from "next/image";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  atomDark,
  solarizedlight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Refactored CertContent component
const CertContent = ({ cert, currentTheme }) => {
  const { content, slug, image } = cert;
  const imagePath = `/images/certs/${slug}/${image}`;

  // Refactored renderCode function to be more concise
  // Removed unnecessary destructuring and commonProps object
  const renderCode = ({ className, children }) => {
    const language = className.split('-')[1];
    const style = currentTheme === 'dark' ? atomDark : solarizedlight;

    return (
      <SyntaxHighlighter
        style={style}
        language={language}
        showLineNumbers
      >
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

export default CertContent;
