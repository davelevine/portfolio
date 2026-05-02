import { useMemo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

// Import languages
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml';
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java';
import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp';
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go';
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import nginx from 'react-syntax-highlighter/dist/cjs/languages/prism/nginx';
import docker from 'react-syntax-highlighter/dist/cjs/languages/prism/docker';
import ini from 'react-syntax-highlighter/dist/cjs/languages/prism/ini';

// Register languages
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('xml', markup);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('cs', csharp);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('nginx', nginx);
SyntaxHighlighter.registerLanguage('docker', docker);
SyntaxHighlighter.registerLanguage('ini', ini);

import Lightbox from 'yet-another-react-lightbox';
import { Thumbnails, Download, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import classes from './blogContent.module.scss';

// Single theme driven by CSS variables — light/dark switch via :root vs [data-theme='dark']
const KEYWORD = 'var(--code-block-keyword)';
const NUMBER = 'var(--code-block-number)';
const STRING = 'var(--code-block-string)';
const TEXT = 'var(--code-block-text)';
const COMMENT = 'var(--code-block-comment)';

const baseBlock = {
  color: TEXT,
  background: 'var(--code-block-bg)',
  fontFamily: 'var(--font-fira-code), Menlo, monospace',
  fontSize: '14px',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  lineHeight: '1.5',
  tabSize: 4,
  hyphens: 'none',
};

const syntaxTheme = {
  'code[class*="language-"]': { ...baseBlock, padding: 0 },
  'pre[class*="language-"]': { ...baseBlock, margin: 0, padding: 0, overflow: 'auto' },

  // Comments
  comment: { color: COMMENT, fontStyle: 'italic' },
  prolog: { color: COMMENT },
  doctype: { color: COMMENT },
  cdata: { color: COMMENT },

  // Keywords / identifiers / structure
  keyword: { color: KEYWORD },
  property: { color: KEYWORD },
  tag: { color: KEYWORD },
  'class-name': { color: KEYWORD },
  'attr-name': { color: KEYWORD },
  selector: { color: KEYWORD },
  'selector-tag': { color: KEYWORD },
  'selector-class': { color: KEYWORD },
  'selector-attr': { color: KEYWORD },
  'selector-pseudo': { color: KEYWORD },
  function: { color: KEYWORD },
  'function-variable': { color: KEYWORD },
  method: { color: KEYWORD },
  variable: { color: KEYWORD },
  important: { color: KEYWORD },
  rule: { color: KEYWORD },
  atrule: { color: KEYWORD },
  'shell-symbol': { color: KEYWORD },
  command: { color: KEYWORD },
  parameter: { color: KEYWORD },
  'command-name': { color: KEYWORD },
  section: { color: KEYWORD },

  // Numbers / booleans / literals
  number: { color: NUMBER },
  boolean: { color: NUMBER },
  regex: { color: NUMBER },
  'attr-value': { color: NUMBER },
  literal: { color: NUMBER },
  constant: { color: NUMBER },

  // Strings (now distinct from default text)
  string: { color: STRING },
  char: { color: STRING },
  'template-string': { color: STRING },
  url: { color: STRING },

  // Default-text tokens
  builtin: { color: TEXT },
  entity: { color: TEXT },
  symbol: { color: TEXT },
  punctuation: { color: TEXT },
  operator: { color: TEXT },
  namespace: { color: TEXT },
  'attr-equals': { color: TEXT },
  delimiter: { color: TEXT },
  'yaml-punctuation': { color: TEXT },

  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

// Component for copy button
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <button
      onClick={copyToClipboard}
      className={classes.copyButton}
      aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
      aria-live="polite"
      title={copied ? 'Copied!' : 'Copy code to clipboard'}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      )}
    </button>
  );
};

const BlogContent = ({ 
  blog: { content, title, categories, date }, 
  currentTheme, 
  showModal = false 
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [images, setImages] = useState([]);
  const hasAnimated = useRef(false);

  // Comprehensive language mapping
  const getLanguage = (lang) => {
    const languageMap = {
      // Web languages
      'html': 'markup',
      'xml': 'markup',
      'svg': 'markup',
      'mathml': 'markup',
      'css': 'css',
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'typescript',

      // Scripting languages
      'py': 'python',
      'python': 'python',
      'rb': 'ruby',
      'ruby': 'ruby',
      'php': 'php',
      'pl': 'perl',
      'perl': 'perl',
      'lua': 'lua',
      'sh': 'bash',
      'bash': 'bash',
      'shell': 'bash',
      'zsh': 'bash',
      'ps': 'powershell',
      'ps1': 'powershell',
      'powershell': 'powershell',

      // Compiled languages
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'csharp': 'csharp',
      'go': 'go',
      'golang': 'go',
      'rs': 'rust',
      'rust': 'rust',
      'dart': 'dart',
      'swift': 'swift',
      'kt': 'kotlin',
      'kotlin': 'kotlin',
      'scala': 'scala',

      // Data languages
      'json': 'json',
      'yml': 'yaml',
      'yaml': 'yaml',
      'toml': 'toml',
      'sql': 'sql',
      'graphql': 'graphql',
      'gql': 'graphql',

      // Config languages
      'dockerfile': 'docker',
      'docker': 'docker',
      'nginx': 'nginx',
      'apache': 'nginx',
      'tf': 'clike',
      'hcl': 'clike',
      'terraform': 'clike',
      'ini': 'ini',
      'systemd': 'ini',
      'cron': 'bash',
      'crontab': 'bash',

      // Other
      'md': 'markdown',
      'markdown': 'markdown',
      'r': 'javascript',
      'scheme': 'javascript',
      'lisp': 'javascript',
      'scss': 'scss',
      'sass': 'scss',
      'text': 'markdown',
    };

    return languageMap[lang.toLowerCase()] || 'javascript';
  };

  // Custom renderer for systemd/ini files
  const customSystemdRenderer = (codeString) => {
    if (!codeString) return codeString;

    // Use regex to find sections and property=value pairs, but don't modify the string
    // Just return the original string - we'll let the syntax highlighter handle it
    return codeString;
  };

  const customRenderers = useMemo(() => ({
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';
      const mappedLang = getLanguage(lang);

      if (!inline && match) {
        const codeString = String(children).replace(/\n$/, '');

        // For systemd/ini files we'll just pass the content directly
        // and rely on the ini syntax highlighting to handle it

        return (
          <div className={classes.codeBlockContainer}>
            <div className={classes.codeHeader}>
              <CopyButton text={codeString} />
            </div>
            <SyntaxHighlighter
              style={syntaxTheme}
              language={mappedLang}
              PreTag="div"
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: '2em',
                color: 'var(--code-block-line-number)',
                textAlign: 'right',
                paddingRight: '1em',
                userSelect: 'none',
                opacity: 0.7,
              }}
              customStyle={{
                margin: 0,
                padding: '1em 1.25em',
                background: 'var(--code-block-bg)',
                borderRadius: 0,
              }}
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className={classes.inlineCode} {...props}>
          {children}
        </code>
      );
    },
    // Rest of your component unchanged
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
          role="img"
          aria-label={alt || 'Blog image'}
        />
      );
    },
  }), [currentTheme, images]);

  // The rest of your component stays the same
  useEffect(() => {
    const imgRegex = /!\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
    const imgMatches = [];
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      imgMatches.push({ src: match[2], alt: match[1] });
    }

    setImages(imgMatches);
  }, [content]);

  useEffect(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflow = showModal ? 'hidden' : 'auto';
    bodyStyle.paddingRight = '0px';

    return () => {
      bodyStyle.overflow = 'auto';
    };
  }, [showModal]);

  const readingTime = useMemo(
    () => Math.ceil(content.split(' ').length / 200),
    [content]
  );

  const formattedDate = useMemo(() => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }, [date]);

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
          <motion.h1
            initial={hasAnimated.current ? {} : { opacity: 0, x: -600 }}
            animate={hasAnimated.current ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onAnimationComplete={() => {
              hasAnimated.current = true;
            }}
          >
            {title}
          </motion.h1>
          <motion.small
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.2 }}
          >
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
          </motion.small>

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
        plugins={[Download, Fullscreen, Thumbnails, Zoom]}
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
    title: PropTypes.string.isRequired,
    categories: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    date: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  currentTheme: PropTypes.oneOf(['dark', 'light']).isRequired,
  showModal: PropTypes.bool,
};

export default BlogContent;
