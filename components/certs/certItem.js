import { useState } from 'react';
import classes from './certItem.module.scss';
import { useEffect, useMemo } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Modal from 'react-modal';

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
  // State to manage lightbox visibility
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Memoize current date to avoid recalculating on each render
  const currentDate = useMemo(() => new Date(), []);
  // Memoize expiration date to avoid recalculating on each render
  const expirationDate = useMemo(() => new Date(date), [date]);

  // Determine the status of the date
  const dateStatus = expirationDate < currentDate ? 'Expired' : 'Expires';
  // Memoize the formatted date to avoid recalculating on each render
  const expiresDate = useMemo(() => formatDate(date, dateStatus), [date, dateStatus]);

  // Memoize the link path to avoid recalculating on each render
  const linkPath = useMemo(() => `/images/certs/${image}`, [image]);

  // Initialize AOS library on component mount
  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className={classes.card} data-aos='zoom-in-up'>
      <div className={classes.cardContent}>
        <h4>{title}</h4>
        <time>{expiresDate}</time>
        <p>{excerpt}</p>
      </div>
      <div className={classes.cardAction}>
        <button onClick={openModal}>
          View certificate
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

export default CertItem;
