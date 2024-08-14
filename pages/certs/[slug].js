import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getCertData, getCertsFiles } from '../../util/certs-util';
import { motion } from 'framer-motion';
import classes from '../../components/certs/certContent.module.scss';

// Dynamically import CertContent for code splitting with SSR support
const CertContent = dynamic(() => import('../../components/certs/certContent'), {
  loading: () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={classes.spinner}
    />
  ),
});

const CertDetailPage = ({ cert, currentTheme }) => {
  // Use a fallback UI for better performance
  if (!cert) {
    return <p>Certificate not found.</p>;
  }

  return (
    <>
      <Head>
        <title>{cert.title}</title>
        <meta name='description' content={cert.excerpt || 'No description available'} />
      </Head>
      <CertContent cert={cert} currentTheme={currentTheme} />
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const certData = await getCertData(slug);

  // Return 404 if cert data is not found
  if (!certData) {
    return { notFound: true };
  }

  return {
    props: {
      cert: certData,
    },
    revalidate: 600, // Incremental Static Regeneration
  };
};

export const getStaticPaths = async () => {
  const certFilenames = await getCertsFiles();
  const slugs = certFilenames.map(fileName => fileName.replace(/\.md$/, ''));

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking', // Use blocking fallback for better performance
  };
};

export default CertDetailPage;