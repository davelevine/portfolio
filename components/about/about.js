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
              I am a skilled information systems professional with a knack for building relationships and technical expertise to drive business achievements. I'm experienced in leading diverse teams to analyze business processes, improve technical aspects, ensure quality, and enhance web-based solutions. 
            </p>
            <br></br>
            <p>
              Most recently, I work closely with the Solutions Architect to shape application architecture, refine development processes, and participate in solution design conversations to meet business needs.
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
              &quot;Your input determines your outlook. Your outlook determines your output, and your output determines your future. 
              <p>
              - Zig Ziglar&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
