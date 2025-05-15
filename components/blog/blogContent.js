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

// Custom syntax highlighting theme for dark mode
const syntaxTheme = {
  'code[class*="language-"]': {
    color: '#cdd9e5',
    background: '#1B1C32',
    fontFamily: 'monospace',
    fontSize: '14px',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none',
    padding: 0,
  },
  'pre[class*="language-"]': {
    color: '#cdd9e5',
    background: '#1B1C32',
    fontFamily: 'monospace',
    fontSize: '14px',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none',
    margin: 0,
    padding: 0,
    overflow: 'auto',
  },
  // Comments - consistent across all languages
  comment: { color: '#6a8a99' },
  prolog: { color: '#6a8a99' },
  doctype: { color: '#6a8a99' },
  cdata: { color: '#6a8a99' },

  // Keywords, properties, tags, selectors - consistently in lime green
  keyword: { color: '#a3e600' },
  property: { color: '#a3e600' },
  tag: { color: '#a3e600' },
  'class-name': { color: '#a3e600' },
  'attr-name': { color: '#a3e600' },
  selector: { color: '#a3e600' },
  'selector-tag': { color: '#a3e600' },
  'selector-class': { color: '#a3e600' },
  'selector-attr': { color: '#a3e600' },
  'selector-pseudo': { color: '#a3e600' },

  // Functions and methods - lime green
  function: { color: '#a3e600' },
  'function-variable': { color: '#a3e600' },
  method: { color: '#a3e600' },

  // Numbers, booleans, regex - accent color
  number: { color: '#ff5d5d' },
  boolean: { color: '#ff5d5d' },
  regex: { color: '#ff5d5d' },
  'attr-value': { color: '#ff5d5d' },

  // Strings, punctuation, operators - default text
  string: { color: '#cdd9e5' },
  char: { color: '#cdd9e5' },
  builtin: { color: '#cdd9e5' },
  entity: { color: '#cdd9e5' },
  url: { color: '#cdd9e5' },
  symbol: { color: '#cdd9e5' },
  punctuation: { color: '#cdd9e5' },
  operator: { color: '#cdd9e5' },

  // Language specific tokens
  // Markup (HTML/XML)
  namespace: { color: '#cdd9e5' },

  // CSS
  important: { color: '#a3e600' },
  rule: { color: '#a3e600' },
  atrule: { color: '#a3e600' },

  // JavaScript/TypeScript
  'template-string': { color: '#cdd9e5' },
  literal: { color: '#ff5d5d' },
  variable: { color: '#a3e600' },
  'attr-equals': { color: '#cdd9e5' },

  // PHP
  delimiter: { color: '#cdd9e5' },

  // Shell
  'shell-symbol': { color: '#a3e600' },
  command: { color: '#a3e600' },
  parameter: { color: '#a3e600' },
  'command-name': { color: '#a3e600' },

  // YAML
  'yaml-punctuation': { color: '#cdd9e5' },

  // INI-specific tokens
  section: { color: '#a3e600' },
  constant: { color: '#ff5d5d' },

  // Special formats
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

// Light theme version with consistent styling
const lightSyntaxTheme = {
  ...syntaxTheme,
  'code[class*="language-"]': {
    ...syntaxTheme['code[class*="language-"]'],
    color: '#2c3e50',
    background: '#f5f5f5',
  },
  'pre[class*="language-"]': {
    ...syntaxTheme['pre[class*="language-"]'],
    color: '#2c3e50',
    background: '#f5f5f5',
  },
  // Matching the exact colors from the screenshot
  comment: { color: '#a0a0a0' },
  prolog: { color: '#a0a0a0' },
  doctype: { color: '#a0a0a0' },
  cdata: { color: '#a0a0a0' },

  // Keywords in magenta
  keyword: { color: '#FF0084' },
  property: { color: '#FF0084' },
  tag: { color: '#FF0084' },
  'class-name': { color: '#FF0084' },
  'attr-name': { color: '#FF0084' },
  selector: { color: '#FF0084' },
  'selector-tag': { color: '#FF0084' },
  'selector-class': { color: '#FF0084' },
  'selector-attr': { color: '#FF0084' },
  'selector-pseudo': { color: '#FF0084' },
  function: { color: '#FF0084' },
  'function-variable': { color: '#FF0084' },
  method: { color: '#FF0084' },

  // Numbers and values in slightly different color
  number: { color: '#EF5350' },
  boolean: { color: '#EF5350' },
  regex: { color: '#EF5350' },
  'attr-value': { color: '#EF5350' },

  // Regular text/strings in dark gray
  string: { color: '#2c3e50' },
  char: { color: '#2c3e50' },
  builtin: { color: '#2c3e50' },
  entity: { color: '#2c3e50' },
  url: { color: '#2c3e50' },
  symbol: { color: '#2c3e50' },
  punctuation: { color: '#2c3e50' },
  operator: { color: '#2c3e50' },

  // Other language-specific tokens for light theme
  variable: { color: '#FF0084' },
  important: { color: '#FF0084' },
  rule: { color: '#FF0084' },
  atrule: { color: '#FF0084' },
  'shell-symbol': { color: '#FF0084' },
  command: { color: '#FF0084' },
  parameter: { color: '#FF0084' },
  'command-name': { color: '#FF0084' },

  // INI-specific tokens for light theme
  section: { color: '#FF0084' },
  constant: { color: '#EF5350' },
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
      aria-label="Copy code to clipboard"
      title="Copy code to clipboard"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              style={currentTheme === 'dark' ? syntaxTheme : lightSyntaxTheme}
              language={mappedLang}
              PreTag="div"
              showLineNumbers={true}
              lineNumberStyle={{ 
                minWidth: '2em',
                color: currentTheme === 'dark' ? '#6a8a99' : '#a0a0a0',
                textAlign: 'right',
                paddingRight: '1em',
                userSelect: 'none',
                opacity: 0.7,
              }}
              customStyle={{
                margin: 0,
                padding: '0.75em 0',
                background: currentTheme === 'dark' ? '#1B1C32' : '#f5f5f5',
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
