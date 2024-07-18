// Import required modules and components
import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import Aos from 'aos'; // Library for scroll animations
import 'aos/dist/aos.css'; // Styles for AOS animations
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence for animations

import classes from './about.module.scss';
import dynamic from 'next/dynamic'; // Import dynamic for code splitting

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

    // Update document title
    document.title = 'Dave Levine - About Me';
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
    <section className={classes.about} id='about'>
      <div className={classes.container}>
        <h2 data-aos='slide-right'>ABOUT ME</h2>

        <div className={classes.row}>
          <div className={classes.columnLeft} data-aos='fade-right'>
            {/* Text content with data-aos animation attributes */}
            <h1>Designing effective solutions, organizing knowledge, and conveying complexity through visual design.</h1>
            <br />
            <p className={classes.h3}>
              I&apos;m an information systems pro with a knack for building relationships and technical expertise to make great things happen. I&apos;m experienced in leading diverse teams, and together, we&apos;ve tackled the finer details of business processes, enhanced the technical aspects, ensured top-notch quality, and made web-based solutions shine.
            </p>
            <br />
            <p className={classes.h3}>
              Most recently, my role involves shaping application architecture, fine-tuning development processes, and actively participating in solution design discussions to meet specific business needs.
            </p>
          </div>

          <div className={classes.columnRight}>
            {/* Image container with profile picture using Next.js Image component with preload */}
            <div className={classes.imageContainer}>
              <Image
                src='https://cdn.levine.io/uploads/portfolio/public/images/avatar.webp'
                width={500}
                height={500}
                alt='profile-pic'
                data-aos='fade-left'
                priority
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
            </div>
            <div className={classes.quote} data-aos='fade-right'></div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {/* Display the modal when showModal is true */}
        {showModal && <Modal contact={modalType === 'contact'} onClose={closeModalHandler} />}
      </AnimatePresence>
    </section>
  );
};

// Export the About component
export default About;
