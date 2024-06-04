import classes from './contactModal.module.scss';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'framer-motion';

function ContactModal(props) {
  const [state, handleSubmit] = useForm('xzbloaed'); // TODO: replaceWithYourOwn
  console.log(state);

  // Refactored common modal content into a separate function for reusability and clarity
  const renderModalContent = (title, message, showLinks = true) => (
    <div className={classes.modal}>
      <div className={`${classes.contactModal} ${classes.contactModalConfirmation}`}>
        <a href='#!' className={classes.close} onClick={props.onClose}>
          <i className='fa fa-xmark'></i>
        </a>
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
                <i className='fa fa-key'></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (state && state.submitting) {
    return renderModalContent('Sending Message', 'Just a sec...');
  }

  if (state && state.succeeded) {
    return (
      <div className={classes.modal}>
        <div className={`${classes.contactModal} ${classes.contactModalConfirmation}`}>
          <a href='#!' className={classes.close} onClick={props.onClose}>
            <i className='fa fa-xmark'></i>
          </a>
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
                <i className='fa fa-key'></i>
              </a>
            </div>
          </div>

          <div className={classes.confirmationButton}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='btn btn-filled'
              onClick={props.onClose}
              aria-label="Close Confirmation" // Accessible name for the button
            >
              OK
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (state && state.errors && state.errors.length > 0) {
    return renderModalContent('Error!', state.errors[0].message);
  }

  return (
    <div className={classes.modal}>
      <div className={classes.contactModal}>
        <a href='#!' className={classes.close} onClick={props.onClose}>
          <i className='fa fa-xmark'></i>
        </a>

        <h2>Contact me</h2>

        <form id='contactForm' className={classes.contactForm} onSubmit={handleSubmit}>
          <div className={classes.row}>
            <div className={classes.inputField}>
              <label htmlFor='email'>Email Address</label>
              <input id='email' type='email' name='email' required />

              <ValidationError prefix='Email' field='email' errors={state.errors} />
            </div>
          </div>
          <div className={classes.inputField}>
            <textarea id='message' name='message' required />
            <ValidationError prefix='Message' field='message' errors={state.errors} />
          </div>

          <div className={classes.action}>
            <div className={classes.contactLinks}>
              <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer'>
                <i className='fab fa-linkedin'></i>
              </a>
              <a href='/assets/dave.levine.io-pgp-key-pub.asc' target='_blank' rel='noreferrer'>
                <i className='fa fa-key' style={{fontSize: '3.2em'}}></i>
              </a>
            </div>
            <div className={classes.sendLink}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type='submit'
                disabled={state.submitting}
                className='btn btn-filled'
                aria-label="Send Message" // Accessible name for the button
              >
                Send Message
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
