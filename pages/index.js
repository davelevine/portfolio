import Head from 'next/head';
import Hero from '../components/home/hero';
import { getFeaturedCerts } from '../util/certs-util';
import { getFeaturedProjects } from '../util/projects-util';

// Refactored Home component to use destructuring directly in the function parameter for cleaner code
export default function Home({ certs, featuredProjects }) {
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

// Refactored getStaticProps to use async/await for better readability and handling of asynchronous operations
export const getStaticProps = async () => {
  const featuredCerts = await getFeaturedCerts(); // Fetch featured certs
  const featuredProjects = await getFeaturedProjects(); // Fetch featured projects

  return {
    props: {
      certs: featuredCerts, // Pass the featured certs to the component
      featuredProjects: featuredProjects, // Pass the featured projects to the component
    },
  };
}
