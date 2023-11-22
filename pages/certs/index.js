import Head from 'next/head';
import { getAllCerts } from '../../util/certs-util';
import AllCerts from '../../components/certs/allCerts';

const Certs = (props) => {
  const { certs } = props;

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

export const getStaticProps = (context) => {
  const allCerts = getAllCerts();

  return {
    props: {
      certs: allCerts,
    },
  };
};
