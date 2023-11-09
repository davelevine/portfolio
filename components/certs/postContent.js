import ReactMarkdown from 'react-markdown';
import classes from './postContent.module.scss';
import Image from "next/image";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  atomDark,
  solarizedlight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';

const PostContent = ({ post, currentTheme }) => {
  const { title, content, slug, image } = post;
  const imagePath = `/images/posts/${slug}/${image}`;

  const renderCode = (code) => {
    const { className, children } = code;
    const language = className.split('-')[1];

    const commonProps = {
      showLineNumbers: true,
      language,
      children,
    };

    return (
      <SyntaxHighlighter
        style={currentTheme === 'dark' ? atomDark : solarizedlight}
        {...commonProps}
      />
    );
  };

  return (
    <div className={classes.postContent}>
      <div className={classes.container}>
        <article>
          <ReactMarkdown components={{ code: renderCode }}>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default PostContent;
