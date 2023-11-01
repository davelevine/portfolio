import classes from './footer.module.scss';

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.socialMedia}>
        <a href='https://github.com/davelevine' target='_blank' rel='noreferrer' aria-label="GitHub Profile">
          <i className='fab fa-github'></i>
        </a>
        <a href='https://www.linkedin.com/in/iamdavelevine' target='_blank' rel='noreferrer' aria-label="LinkedIn Profile">
          <i className='fab fa-linkedin'></i>
        </a>
      </div>
      <div>© Dave Levine</div>
      <small>
        Icons by{' '}
        <a href='https://www.flaticon.com/' target='_blank' rel='noreferrer'>
          Flaticon
        </a>{' '}
        &{' '}
        <a href='https://fontawesome.com/' target='_blank' rel='noreferrer'>
          Font Awesome
        </a>
      </small>
    </footer>
  );
};

export default Footer;
