import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './certItem.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

/**
 * Helper function to format the date.
 * @param {string} date - The date string to format.
 * @param {string} status - The status of the date (e.g., 'Expired', 'Expires', 'Achieved').
 * @param {boolean} isAchieved - Whether the date is an achieved date.
 * @returns {JSX.Element} The formatted date element.
 */
const formatDate = (date, status, isAchieved = false) => {
  if (date === 'Never') {
    return (
      <span className={classes.never}>
        <strong>
          <i className="fa-solid fa-infinity"></i> Never
        </strong>
      </span>
    );
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <span className={isAchieved ? classes.achieved : status === 'Expired' ? classes.expired : classes.expires}>
      <strong>
        <i className={isAchieved ? 'fa-regular fa-medal' : status === 'Expired' ? 'fa-regular fa-calendar-xmark' : 'fa-regular fa-calendar-check'}></i> 
        {formattedDate}
      </strong>
    </span>
  );
};

/**
 * CertItem component renders a certification item with a modal to view the certificate image.
 * @param {Object} props - Component properties.
 * @param {Object} props.cert - Certification data.
 * @param {string} props.cert.title - Title of the certification.
 * @param {string} props.cert.excerpt - Excerpt of the certification.
 * @param {string} props.cert.expirationDate - Expiration date of the certification.
 * @param {string} props.cert.achievedDate - Achieved date of the certification.
 * @param {string} props.cert.image - Image filename for the certification.
 * @returns {JSX.Element} The rendered component.
 */
const CertItem = ({ cert }) => {
  const { title, excerpt, expirationDate, achievedDate, image } = cert;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const achievedDateObj = new Date(achievedDate);
  const expDate = expirationDate === 'Never' ? 'Never' : new Date(expirationDate);
  const dateStatus = expDate === 'Never' ? 'Never' : (expDate < new Date() ? 'Expired' : 'Expires');

  // Format the dates for display
  const achievedDateFormatted = formatDate(achievedDate, 'Achieved', true);
  const expiresDateFormatted = expDate === 'Never' ? formatDate('Never', 'Never') : (expDate ? formatDate(expirationDate, dateStatus) : null);

  const linkPath = `https://cdn.levine.io/uploads/portfolio/public/images/certs/${image}`;

  useEffect(() => {
    Aos.init({ duration: 500 });
    Modal.setAppElement('#__next');
  }, []);

  const toggleModal = useCallback(() => {
    setModalIsOpen(prevState => !prevState);
  }, []);

  return (
    <div className={classes.card} data-aos='zoom-in-up'>
      <div className={classes.cardContent}>
        <h4 onClick={toggleModal}>{title}</h4>
        <p>{excerpt}</p>
      </div>
      <div className={classes.dates}>
        <time>{achievedDateFormatted}</time>
        {expiresDateFormatted && <time>{expiresDateFormatted}</time>}
      </div>
      <div className={classes.cardAction}>
        <button onClick={toggleModal}>
          <i className="fa-regular fa-arrow-up-right-from-square"></i> View Certificate
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="Certificate Image"
        className={classes.modal}
        overlayClassName={classes.overlay}
      >
        <button onClick={toggleModal} className={classes.closeButton}>
          <i className='fa-regular fa-xmark'></i>
        </button>
        <Image src={linkPath} alt={`Certificate for ${title}`} className={classes.certImage} width={700} height={475} />
      </Modal>
    </div>
  );
};

CertItem.propTypes = {
  cert: PropTypes.shape({
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    expirationDate: PropTypes.string.isRequired,
    achievedDate: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default CertItem;