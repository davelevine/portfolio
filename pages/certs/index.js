import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getAllCerts } from '../../util/certs-util';
import classes from '../../components/certs/certContent.module.scss';

// Dynamically import AllCerts for code splitting with SSR support
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
  // Use a fallback UI for better performance
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

  // Return 404 if no certifications are found
  if (!allCerts) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      certs: allCerts,
    },
    revalidate: 600, // Incremental Static Regeneration for better performance
  };
};