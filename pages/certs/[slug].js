import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getCertData, getCertsFiles } from '../../util/certs-util';
import { motion } from 'framer-motion';
import classes from '../../components/certs/certContent.module.scss';

// Dynamically import CertContent for code splitting
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
  // Destructured props directly in the function parameter for cleaner code

  return (
    <>
      <Head>
        <title>{cert.title}</title>
        <meta name='description' content={cert.excerpt} />
      </Head>
      <CertContent cert={cert} currentTheme={currentTheme} />
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  // Destructured context directly in the function parameter for cleaner code
  const { slug } = params;
  const certData = await getCertData(slug); // Updated the function call and added async/await for better readability and handling of asynchronous operations

  return {
    props: {
      cert: certData,
    },
    revalidate: 600,
  };
};

export const getStaticPaths = async () => {
  const certFilenames = await getCertsFiles(); // Updated the function call and added async/await for better readability and handling of asynchronous operations
  const slugs = certFilenames.map((fileName) => fileName.replace(/\.md$/, ''));

  return {
    paths: slugs.map((slug) => ({ params: { slug } })), // Simplified object property shorthand
    fallback: false,
  };
};

export default CertDetailPage;
