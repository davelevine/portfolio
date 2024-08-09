import { useMemo, lazy, Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Aos from 'aos'; 
import 'aos/dist/aos.css';
import dynamic from 'next/dynamic';
import classes from './now.module.scss';

const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(mod => mod.Prism));
const atomDark = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.atomDark));
const solarizedlight = lazy(() => import('react-syntax-highlighter/dist/cjs/styles/prism').then(mod => mod.solarizedlight));

const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

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
  strong: ({ children }) => <strong className={classes.highlighted}>{children}</strong>,
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
          <Suspense fallback={<div>Loading...</div>}>
            <ReactMarkdown components={customRenderers}>
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
