import classes from './about.module.scss';
import { useEffect } from 'react';
import Image from 'next/image';
import Aos from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  return (
    <section className={classes.about} id='about'>
      <div className={classes.container}>
        <h2 data-aos='slide-right'>About me</h2>

        <div className={classes.row}>
          <div className={classes.columnLeft} data-aos='fade-right'>
            <p>
              <h1>Designing effective solutions, organizing knowledge, and conveying complexity through visual design.</h1>
            <p/>
            <br />
              I&apos;m an information systems pro with a knack for building relationships and technical expertise to make great things happen for businesses. I&apos;m experienced in leading diverse teams and together, we&apos;ve tackled the nitty-gritty of business processes, amped up the tech stuff, ensured top-notch quality, and made web-based solutions shine.
            </p>
            <br />
            <p>
              Most recently, I work closely with the Solutions Architect to shape application architecture, fine-tune development processes, and participate in solution design discussions to meet business needs.
            </p>
          </div>

          <div className={classes.columnRight}>
            <div className={classes.imageContainer}>
              <Image
                src='/images/simple.jpg'
                width={600}
                height={600}
                alt='profile-pic'
                data-aos='fade-left'
              />
            </div>
            <div className={classes.quote} data-aos='fade-right'>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
