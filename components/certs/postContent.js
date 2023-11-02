import ReactMarkdown from 'react-markdown';
import classes from './postContent.module.scss';
import Image from "next/legacy/image";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  atomDark,
  solarizedlight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';

const PostContent = (props) => {
  const { post, currentTheme } = props;

  const title = post.title;
  const content = post.content;
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  const customRenderers = {
    code(code) {
      const { className, children } = code;
      const language = className.split('-')[1]; // className is something like language-js => We need the "js" part here

      return (
        <>
          {currentTheme === 'dark' ? (
            <SyntaxHighlighter
              showLineNumbers
              language={language}
              style={atomDark}
              // eslint-disable-next-line react/no-children-prop
              children={children}
            />
          ) : (
            <SyntaxHighlighter
              showLineNumbers
              language={language}
              style={solarizedlight}
              // eslint-disable-next-line react/no-children-prop
              children={children}
            />
          )}
        </>
      );
    },
  };

  return (
    <div className={classes.postContent}>
      <div className={classes.container}>
        <article>
          <Image
            src={imagePath}
            alt={title} // Set alt text as appropriate
            loading="eager" // Set loading attribute to 'eager' to indicate preload
            layout='fill'
          />
          <ReactMarkdown components={customRenderers}>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default PostContent;
