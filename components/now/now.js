import { useEffect, useMemo } from 'react';
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
  blockquote({ node, children, ...props }) {
    return (
      <div className={classes.quoteBox}>
        <blockquote {...props}>
          {children}
        </blockquote>
      </div>
    );
  },
  hr: () => <hr className={classes.divider} />,
  strong: ({ children }) => <strong className={classes.highlighted}>{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className={classes.link} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }) => (
    <img src={src} alt={alt} className={classes.blogImage} style={{ maxWidth: '80%', height: 'auto' }} {...props} />
  ),
});

const Now = ({ markdownContent, currentTheme = 'light', showModal = false }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Aos.init({ duration: 550 });
      document.title = 'Dave Levine - Now';
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bodyStyle = document.body.style;
      bodyStyle.overflow = showModal ? 'hidden' : 'auto';
      bodyStyle.paddingRight = '0px';
    }
  }, [showModal]);

  const customRenderers = useMemo(() => getCustomRenderers(currentTheme), [currentTheme]);

  return (
    <div className={classes.now}>
      <div className="container section mvh-100">
        <div className={classes.card}>
          <ReactMarkdown
            components={customRenderers}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
      {showModal && <Modal />}
    </div>
  );
};

Now.propTypes = {
  markdownContent: PropTypes.string.isRequired,
  currentTheme: PropTypes.oneOf(['dark', 'light']),
  showModal: PropTypes.bool,
};

export default Now;
