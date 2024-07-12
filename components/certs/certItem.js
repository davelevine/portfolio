import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './certItem.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Modal from 'react-modal';
import Image from 'next/image';

// Set the app element for react-modal to ensure accessibility
Modal.setAppElement('#__next');

/**
 * Helper function to format the date.
 * @param {string} date - The date string to format.
 * @param {string} status - The status of the date (e.g., 'Expired', 'Expires').
 * @returns {JSX.Element} The formatted date element.
 */
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

/**
 * CertItem component renders a certification item with a modal to view the certificate image.
 * @param {Object} props - Component properties.
 * @param {Object} props.cert - Certification data.
 * @param {string} props.cert.title - Title of the certification.
 * @param {string} props.cert.excerpt - Excerpt of the certification.
 * @param {string} props.cert.date - Expiration date of the certification.
 * @param {string} props.cert.image - Image filename for the certification.
 * @returns {JSX.Element} The rendered component.
 */
const CertItem = ({ cert: { title, excerpt, date, image } }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const currentDate = new Date();
  const expirationDate = new Date(date);
  const dateStatus = expirationDate < currentDate ? 'Expired' : 'Expires';
  const expiresDate = formatDate(date, dateStatus);
  const linkPath = `/images/certs/${image}`;

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  const toggleModal = useCallback((isOpen) => {
    setModalIsOpen(isOpen);
  }, []);

  return (
    <div className={classes.card} data-aos='zoom-in-up'>
      <div className={classes.cardContent}>
        <h4 onClick={() => toggleModal(true)} style={{ cursor: 'pointer' }}>{title}</h4>
        <time>{expiresDate}</time>
        <p>{excerpt}</p>
      </div>
      <div className={classes.cardAction}>
        <button onClick={() => toggleModal(true)}>
          <i className="fa fa-arrow-up-right-from-square"></i> View certificate
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => toggleModal(false)}
        contentLabel="Certificate Image"
        className={classes.modal}
        overlayClassName={classes.overlay}
      >
        <button onClick={() => toggleModal(false)} className={classes.closeButton}></button>
        <Image src={linkPath} alt={`Certificate for ${title}`} className={classes.certImage} width={700} height={475} />
      </Modal>
    </div>
  );
};

CertItem.propTypes = {
  cert: PropTypes.shape({
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default CertItem;