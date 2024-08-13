import { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Lightbox from 'yet-another-react-lightbox';
import { Thumbnails, Counter, Download, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';

import classes from './blogContent.module.scss';

const BlogContent = ({ blog, currentTheme, showModal = false }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [images, setImages] = useState([]); // Array to store all images in the post

  const {
    content,
    githubLink,
    liveLink,
    title,
    categories,
    date,
    image,
  } = blog;

  const customRenderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={currentTheme === 'dark' ? atomDark : oneLight}
          language={match[1]}
          PreTag="div"
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
    p({ node, children, ...props }) {
      // Check if the paragraph contains just an image
      if (children.length === 1 && children[0].type === 'img') {
        return <div {...props}>{children}</div>;
      }
      return <p {...props}>{children}</p>;
    },
    img({ src, alt }) {
      return (
        <Image
          src={src}
          alt={alt || 'Blog image'}
          width={700}
          height={450}
          className={classes.markdownImage}
          priority
          sizes="(max-width: 768px) 100vw, 700px"
          onClick={() => {
            const index = images.findIndex((img) => img.src === src);
            setLightboxIndex(index);
            setLightboxOpen(true);
          }}
        />
      );
    },
  };

  // Collect all images before rendering
  useEffect(() => {
    const imgRegex = /!\[.*?\]\((.*?)\)/g; // Regex to match all images in markdown
    const imgMatches = [];
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      imgMatches.push({ src: match[1] });
    }

    // Add the main blog image to the array if it exists
    if (image) {
      imgMatches.unshift({
        src: `https://cdn.levine.io/uploads/portfolio/public/images/blog/${image}`,
      });
    }

    setImages(imgMatches);
  }, [content, image]);

  useEffect(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflow = showModal ? 'hidden' : 'auto';
    bodyStyle.paddingRight = '0px';
  }, [showModal]);

  const readingTime = useMemo(
    () => Math.ceil(content.split(' ').length / 200),
    [content]
  );

  const formattedDate = useMemo(() => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }, [date]);

  // Ensure consistent rendering to avoid hydration errors
  const renderedContent = useMemo(() => (
    <ReactMarkdown
      components={customRenderers}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  ), [content, customRenderers]);

  return (
    <div className={classes.blogDetail}>
      <div className="container section mvh-100 blogDetail">
        <div className={classes.card}>
          <h1>{title}</h1>
          <small>
            <span>
              <i className="fa-regular fa-calendar-lines-pen" /> {formattedDate}
            </span>
            <span className={classes.dot}> • </span>
            <span>
              <i className="fa-regular fa-clock" /> {readingTime} min read
            </span>
            <br />
            <span>
              <i className="fa-regular fa-tags" />{' '}
            </span>
            {Array.isArray(categories) ? (
              categories.map((category, index) => (
                <span key={index} className={classes.category}>
                  {category}
                  {index < categories.length - 1 && (
                    <span className={classes.dot}> • </span>
                  )}
                </span>
              ))
            ) : (
              <span className={classes.category}>{categories}</span>
            )}
          </small>

          {image && (
            <div className={classes.blogImage}>
              <Image
                src={`https://cdn.levine.io/uploads/portfolio/public/images/blog/${image}`}
                width={700}
                height={450}
                alt={title}
                priority
                className={classes.blogMainImage}
                sizes="(max-width: 768px) 100vw, 700px"
                onClick={() => {
                  const index = images.findIndex((img) => img.src === `https://cdn.levine.io/uploads/portfolio/public/images/blog/${image}`);
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              />
            </div>
          )}

          <div className={classes.blogLinks}>
            {githubLink && (
              <a href={githubLink} target="_blank" rel="noreferrer">
                <i className="fab fa-github"></i> Github
              </a>
            )}
            {liveLink && (
              <a href={liveLink} target="_blank" rel="noreferrer">
                <i className="fa-regular fa-arrow-up-right-from-square"></i>{' '}
                Website
              </a>
            )}
          </div>

          <div className={classes.divider}></div>

          {renderedContent}

          <div className={classes.btnContainer}>
            <Link href="/blog/">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={classes.btnFilledBlog}
              >
                View All Posts
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        plugins={[Counter, Download, Fullscreen, Thumbnails, Zoom]}
        thumbnails={{
          position: 'bottom',
          width: 100,
          height: 60,
          border: 2,
          gap: 8,
          borderRadius: 8,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
          closeOnPullUp: true,
        }}
        carousel={{ finite: true }}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
      />
    </div>
  );
};

BlogContent.propTypes = {
  blog: PropTypes.shape({
    content: PropTypes.string.isRequired,
    githubLink: PropTypes.string,
    liveLink: PropTypes.string,
    title: PropTypes.string.isRequired,
    categories: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  currentTheme: PropTypes.oneOf(['dark', 'light']).isRequired,
  showModal: PropTypes.bool,
};

export default BlogContent;
