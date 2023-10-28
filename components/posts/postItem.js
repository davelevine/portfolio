import Link from 'next/link';
import classes from './postItem.module.scss'; // Import your SCSS styles
import { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';

const PostItem = (props) => {
  const { title, excerpt, date, slug } = props.post;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  });

  // Use HTML tags to make "Expires" bold and add the appropriate class name
  const expiresDate = (
    <span className={classes.expires}>
      <strong>Expires:</strong> {formattedDate}
    </span>
  );

  const linkPath = `/posts/${slug}`;

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  return (
    <div className={classes.card} data-aos='zoom-in-up'>
      <div className={classes.cardContent}>
        <h4>{title}</h4>
        <time>{expiresDate}</time>
        <p>{excerpt}</p>
      </div>
      <div className={classes.cardAction}>
        <Link href={linkPath}>
          <a>Read more</a>
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
