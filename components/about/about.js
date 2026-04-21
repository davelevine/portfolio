// Import required modules and components
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Aos from 'aos'; // Library for scroll animations
import 'aos/dist/aos.css'; // Styles for AOS animations
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence for animations
import dynamic from 'next/dynamic'; // Import dynamic for code splitting

import classes from './about.module.scss';

// Dynamically import the contact modal for code splitting
const Modal = dynamic(() => import('../layout/modal/contactModal'), {
  loading: () => <div className="skeleton-loader"></div>,
});

// Define the About component
const About = () => {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalType, setModalType] = useState(''); // State to determine modal type

  // Initialize AOS (Animate on Scroll) with a duration of 550 milliseconds
  useEffect(() => {
    Aos.init({ duration: 550 }); // Initialize scroll animations
    document.title = 'Dave Levine - About Me'; // Update document title
  }, []);

  // Function to hide scrollbar
  const hideScrollbar = useCallback(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
    document.body.style.paddingRight = showModal ? '15px' : '0px';
  }, [showModal]);

  // Effects for managing body overflow when the modal is open or closed
  useEffect(() => {
    hideScrollbar();
  }, [showModal, hideScrollbar]);

  // Function to close the modal
  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  return (
    <section className={classes.about} id="about">
      <div className={classes.container}>
        <h2 data-aos="slide-right">ABOUT ME</h2>

        <div className={classes.row}>
          <div className={classes.columnLeft} data-aos="fade-right">
            <h1>Designing effective solutions, organizing knowledge, and conveying complexity through visual design.</h1>
            <br />
            <p className={classes.h3}>
              I&apos;m a Solutions Engineer at Weill Cornell Medicine, where I help keep a portfolio of research administration systems running smoothly. Most of my work lives somewhere between infrastructure, security, and documentation. I like figuring out how things fit together, writing it down clearly, and making sure the next person doesn&apos;t have to start from scratch.
            </p>
            <br />
            <p className={classes.h3}>
              Lately, a lot of my time goes to drawing architecture diagrams, mapping how our services depend on one another, and helping with a big migration to a new system. Outside of work, I build and self-host things I find useful, like a micro-journaling app, my personal knowledge base, and a homelab that&apos;s a constant yet rewarding project.
            </p>
          </div>

          <div className={classes.columnRight}>
            <div className={classes.imageContainer}>
              <Image
                src="https://cdn.levine.io/uploads/portfolio/public/images/avatar.webp"
                width={500}
                height={500}
                alt="profile-pic"
                data-aos="fade-left"
                priority
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <div className={classes.quote} data-aos="fade-right"></div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showModal && <Modal contact={modalType === 'contact'} onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

// Export the About component
export default About;
