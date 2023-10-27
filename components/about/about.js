// Import required modules and components
import classes from './about.module.scss';
import { useEffect } from 'react';
import Image from 'next/image';
import Aos from 'aos'; // Library for scroll animations
import 'aos/dist/aos.css'; // Styles for AOS animations

// Define the About component
const About = () => {
  // Initialize AOS (Animate on Scroll) with a duration of 500 milliseconds
  useEffect(() => {
    Aos.init({ duration: 500 }); // Initialize scroll animations
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
            <p className={classes.h4}>
              I&apos;m an information systems pro with a knack for building relationships and technical expertise to make great things happen for businesses. I&apos;m experienced in leading diverse teams, and together, we&apos;ve tackled the finer details of business processes, enhanced the technical aspects, ensured top-notch quality, and made web-based solutions shine.
            </p>
            <br />
            <p className={classes.h4}>
            Most recently, I have worked closely with the Solutions Architect. My role involves shaping application architecture, fine-tuning development processes, and actively participating in solution design discussions to meet specific business needs.
            </p>
          </div>

          <div className={classes.columnRight}>
            {/* Image container with profile picture using Next.js Image component */}
            <div className={classes.imageContainer}>
              <Image
                src='/images/profile-pic-1.webp'
                width={600}
                height={600}
                alt='profile-pic'
                data-aos='fade-left'
              />
            </div>
            <div className={classes.quote} data-aos='fade-right'></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Export the About component
export default About;
