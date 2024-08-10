import { useMemo, lazy, Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Aos from 'aos'; 
import 'aos/dist/aos.css';
import dynamic from 'next/dynamic';
import classes from './now.module.scss';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

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
  hr: () => <hr className={classes.divider} />, // Ensure that horizontal rules are rendered correctly
  strong: ({ children }) => <strong className={classes.highlighted}>{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className={classes.link} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <div className={classes.imageContainer}>
      <img src={src} alt={alt} className={classes.blogImage} style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  ),
});

const Now = ({ currentTheme, showModal = false }) => {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    Aos.init({ duration: 550 });
    document.title = 'Dave Levine - Now';

    // Fetch the markdown content
    fetch('/data/now/now.md')
      .then((response) => response.text())
      .then((text) => {
        setMarkdownContent(text);
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  const customRenderers = useMemo(() => getCustomRenderers(currentTheme), [currentTheme]);

  return (
    <div className={classes.now}>
      <div className='container section mvh-100'>
        <div className={classes.card}>
          <Suspense fallback={<div>Loading content...</div>}>
            <ReactMarkdown
              components={customRenderers}
              rehypePlugins={[rehypeRaw]}  // Allows raw HTML in markdown
              remarkPlugins={[remarkGfm]} // Enables GitHub flavored markdown (tables, etc.)
            >
              {markdownContent}
            </ReactMarkdown>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

Now.propTypes = {
  currentTheme: PropTypes.oneOf(['dark', 'light']).isRequired,
  showModal: PropTypes.bool,
};

export default Now;
