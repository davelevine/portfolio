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
    </footer>
  );
};

export default Footer;
