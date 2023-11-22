import Link from 'next/link';
import classes from './certItem.module.scss';
import { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';

const formatDate = (date, status) => {
  if (date === 'Never') {
    return <span className={classes.expires}><strong>{status}:</strong> Never</span>;
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  });

  return <span className={status === 'Expired' ? classes.expired : classes.expires}><strong>{status}:</strong> {formattedDate}</span>;
};

const CertItem = (props) => {
  const { title, excerpt, date, slug } = props.cert;

  const currentDate = new Date();
  const expirationDate = new Date(date);

  const dateStatus = expirationDate < currentDate ? 'Expired' : 'Expires';
  const expiresDate = formatDate(date, dateStatus);

  const linkPath = `/certs/${slug}`;

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  return (
    <div className={classes.card} data-aos='zoom-in-up'>
      <div className={classes.cardContent}>
        <Link href={linkPath} passHref legacyBehavior>
          <a>
            <h4>{title}</h4>
          </a>
        </Link>
        <time>{expiresDate}</time>
        <p>{excerpt}</p>
      </div>
      <div className={classes.cardAction}>
        <Link href={linkPath} legacyBehavior>
          <a>
            Read more
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CertItem;
