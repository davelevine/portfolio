import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getAllCerts } from '../../util/certs-util';
import classes from '../../components/certs/certContent.module.scss';

// Dynamically import AllCerts for code splitting
const AllCerts = dynamic(() => import('../../components/certs/allCerts'), {
  loading: () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={classes.spinner}
    />
  ),
});

// Certs component to display all certifications
const Certs = ({ certs }) => {
  // Ensure certs is defined before rendering
  if (!certs || certs.length === 0) {
    return <p>No certifications found.</p>; // Handle case where no certifications are available
  }

  return (
    <>
      <Head>
        <title>Certifications</title>
        <meta
          name='description'
          content='List of all my certifications.'
        />
      </Head>
      <AllCerts certs={certs} />
    </>
  );
};

export default Certs;

// getStaticProps to fetch all certifications
export const getStaticProps = async () => {
  const allCerts = await getAllCerts();

  // Ensure allCerts is valid before returning
  if (!allCerts) {
    return {
      notFound: true, // Return 404 if no certifications are found
    };
  }

  return {
    props: {
      certs: allCerts,
    },
  };
};
