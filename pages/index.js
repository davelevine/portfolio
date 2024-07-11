import Head from 'next/head';
import Hero from '../components/home/hero';
import { getFeaturedCerts } from '../util/certs-util';
import { getFeaturedProjects } from '../util/projects-util';

// Refactored Home component to remove unused destructured elements
export default function Home() {
  return (
    <>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>
        <meta
          name='description' // Changed 'name' to 'description' for better semantics
          content='My personal portfolio including various projects and certifications.'
        />
      </Head>
      <Hero />
    </>
  );
}

// Refactored getStaticProps to remove unused props and optimize fetch with Promise.all
export const getStaticProps = async () => {
  await Promise.all([getFeaturedCerts(), getFeaturedProjects()]); // Fetch featured certs and projects concurrently

  return {
    props: {}, // No props are passed to the component
  };
}
