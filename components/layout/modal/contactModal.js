import dynamic from 'next/dynamic';
import classes from './contactModal.module.scss';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'framer-motion';

const ContactModal = ({ onClose }) => {
  const [state, handleSubmit] = useForm('xzbloaed');

  const CloseButton = () => (
    <button className={classes.close} onClick={onClose} aria-label="Close Modal">
      ✕
    </button>
  );

  const renderModalContent = (title, message, showLinks = true) => (
    <div className={classes.modal}>
      <div className={`${classes.contactModal} ${classes.contactModalConfirmation}`}>
        <CloseButton />
        <div>
          <h2>{title}</h2>
          <p>
            {message}
            {showLinks && (
              <>
                <br />
                Also feel free to contact me via Linkedin or PGP Key:
              </>
            )}
          </p>
          {showLinks && (
            <div className={classes.contactLinks}>
              <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer'>
                <i className='fab fa-linkedin'></i>
              </a>
              <a href='/assets/dave.levine.io-pub.asc' target='_blank' rel='noreferrer'>
                <i className='fa-sharp fa-regular fa-key'></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBasedOnState = () => {
    if (state.submitting) {
      return renderModalContent('Sending Message', 'Just a sec...');
    }

    if (state.succeeded) {
      return (
        <div className={classes.modal}>
          <div className={`${classes.contactModal} ${classes.contactModalConfirmation}`}>
            <CloseButton />
            <div>
              <h2>Thanks for reaching out!</h2>
              <p>
                Your message was sent!
                <br />
                Also feel free to contact me via Linkedin or PGP Key:
              </p>
              <div className={classes.contactLinks}>
                <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer'>
                  <i className='fab fa-linkedin'></i>
                </a>
                <a href='/assets/dave.levine.io-pub.asc' target='_blank' rel='noreferrer'>
                  <i className='fa-sharp fa-regular fa-key'></i>
                </a>
              </div>
            </div>

            <div className={classes.confirmationButton}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='btn btn-filled'
                onClick={onClose}
                aria-label="Close Confirmation"
              >
                OK
              </motion.button>
            </div>
          </div>
        </div>
      );
    }

    if (state.errors && state.errors.length > 0) {
      return renderModalContent('Error!', state.errors[0].message);
    }

    return null;
  };

  return (
    <div className={classes.modal}>
      {renderBasedOnState() || (
        <div className={classes.contactModal}>
          <CloseButton />
          <h2>Contact Me</h2>

          <form id='contactForm' className={classes.contactForm} onSubmit={handleSubmit}>
            <div className={classes.row}>
              <div className={classes.inputField}>
                <label htmlFor='email'>Your Email Address:</label>
                <input 
                  id='email' 
                  type='email' 
                  name='email' 
                  required 
                  autoComplete="email" 
                  placeholder="Where can I send a response?"
                />
                <ValidationError prefix='Email' field='email' errors={state.errors} />
              </div>
            </div>
            <div className={classes.inputField}>
            <label htmlFor='email'>Message:</label>
              <textarea 
                id='message' 
                name='message' 
                required 
                autoComplete="message" 
                placeholder="What would you like to talk about?"
              />
              <ValidationError prefix='Message' field='message' errors={state.errors} />
            </div>

            <div className={classes.action}>
              <div className={classes.contactLinks}>
                <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer'>
                  <i className='fab fa-linkedin'></i>
                </a>
                <a href='/assets/dave.levine.io-pgp-key-pub.asc' target='_blank' rel='noreferrer'>
                  <i className='fa-sharp fa-regular fa-key' style={{fontSize: '3.2em'}}></i>
                </a>
              </div>
              <div className={classes.sendLink}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type='submit'
                  disabled={state.submitting}
                  className='btn btn-filled'
                  aria-label="Send Message"
                >
                  Send Message
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(ContactModal), { ssr: false });
