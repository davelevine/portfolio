import Head from 'next/head';
import Hero from '../components/home/hero';
import { getFeaturedCerts } from '../util/certs-util';
import { getFeaturedProjects } from '../util/projects-util';

export default function Home(props) {
  return (
    <>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>
        <meta
          name='description' // Change 'name' to 'description'
          content='My personal portfolio including various projects and certifications.'
        />
      </Head>
      <Hero />
    </>
  );
}

export const getStaticProps = () => {
  const featuredCerts = getFeaturedCerts(); // Fetch featured certs
  const featuredProjects = getFeaturedProjects(); // Fetch featured projects

  return {
    props: {
      certs: featuredCerts, // Pass the featured certs to the component
      featuredProjects: featuredProjects, // Pass the featured projects to the component
    },
  };
}
