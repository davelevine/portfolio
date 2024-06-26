import Head from 'next/head';
import { getAllCerts } from '../../util/certs-util';
import AllCerts from '../../components/certs/allCerts';

// Refactored Certs component to use destructuring directly in the function parameter
const Certs = ({ certs }) => {
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

// Refactored getStaticProps to use async/await for better readability and handling of asynchronous operations
export const getStaticProps = async () => {
  const allCerts = await getAllCerts();

  return {
    props: {
      certs: allCerts,
    },
  };
};
