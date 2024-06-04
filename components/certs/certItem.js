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
  const { title, excerpt, date, slug, image } = props.cert;

  const currentDate = new Date();
  const expirationDate = new Date(date);

  const dateStatus = expirationDate < currentDate ? 'Expired' : 'Expires';
  const expiresDate = formatDate(date, dateStatus);

  const linkPath = `/images/certs/${image}`;

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
        <a href={linkPath} target="_blank" rel="noopener noreferrer">
          View certificate
        </a>
      </div>
    </div>
  );
};

export default CertItem;
