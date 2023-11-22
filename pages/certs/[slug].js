import Head from 'next/head';
import CertContent from '../../components/certs/certContent'; // Update the import path
import { getCertData, getCertsFiles } from '../../util/certs-util'; // Update the import path

const CertDetailPage = (props) => {
  const { cert, currentTheme } = props;

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

export const getStaticProps = (context) => {
  const { params } = context;
  const { slug } = params;
  const certData = getCertData(slug); // Update the function call

  return {
    props: {
      cert: certData,
    },
    revalidate: 600,
  };
};

export const getStaticPaths = () => {
  const certFilenames = getCertsFiles(); // Update the function call
  const slugs = certFilenames.map((fileName) => fileName.replace(/\.md$/, ''));

  return {
    paths: slugs.map((slug) => ({ params: { slug: slug } })),
    fallback: false,
  };
};

export default CertDetailPage;
