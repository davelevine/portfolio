import { useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import classes from './now.module.scss';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
  ssr: false,
});

const getCustomRenderers = () => ({
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
  img: ({ src, alt, ...props }) => (
    <Image 
      src={src} 
      alt={alt} 
      className={classes.nowImage} 
      layout="responsive" 
      width={700} 
      height={450} 
      loading="eager"
      {...props} 
    />
  ),
  h1: ({ children }) => (
    <motion.h1
      initial={{ opacity: 0, x: -600 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={classes.title}
    >
      {children}
    </motion.h1>
  ),
});

const Now = ({ markdownContent, showModal = false }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Dave Levine - Now';
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = showModal ? 'hidden' : 'auto';
    }
  }, [showModal]);

  return (
    <div className={classes.now}>
      <div className="container section mvh-100">
        <div className={classes.card}>
          <ReactMarkdown
            components={getCustomRenderers()}
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
  showModal: PropTypes.bool,
};

export default Now;
