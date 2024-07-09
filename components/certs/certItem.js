import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './certItem.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Modal from 'react-modal';

// Set the app element for react-modal to ensure accessibility
Modal.setAppElement('#__next');

// Helper function to format the date
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

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  return (
    <div className={classes.card} data-aos='zoom-in-up'>
      <div className={classes.cardContent}>
        <h4 onClick={openModal} style={{ cursor: 'pointer' }}>{title}</h4>
        <time>{expiresDate}</time>
        <p>{excerpt}</p>
      </div>
      <div className={classes.cardAction}>
        <button onClick={openModal}>
          <i className="fas fa-arrow-up-right-from-square"></i> View certificate
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Certificate Image"
        className={classes.modal}
        overlayClassName={classes.overlay}
      >
        <button onClick={closeModal} className={classes.closeButton}></button>
        <img src={linkPath} alt={`Certificate for ${title}`} className={classes.certImage} />
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