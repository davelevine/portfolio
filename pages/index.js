import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getFeaturedCerts } from '../util/certs-util';
import { getFeaturedProjects } from '../util/projects-util';
import { getFeaturedBlog } from '../util/blog-util'; // Changed 'posts-util' to 'blog-util'

// Dynamically import the Hero component for code splitting
const Hero = dynamic(() => import('../components/home/hero'), {
  loading: () => <div className="skeleton-loader"></div>,
});

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
  await Promise.all([getFeaturedCerts(), getFeaturedProjects(), getFeaturedBlog()]); // Changed 'getFeaturedPosts' to 'getFeaturedBlog'

  return {
    props: {}, // No props are passed to the component
  };
}
