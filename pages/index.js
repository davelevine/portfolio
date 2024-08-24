import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getFeaturedCerts } from '../util/certs-util';
import { getFeaturedProjects } from '../util/projects-util';
import { getFeaturedBlog } from '../util/blog-util';

// Dynamically import the Hero component for code splitting
const Hero = dynamic(() => import('../components/home/hero'), {
  loading: () => <div className="skeleton-loader"></div>,
});

// Home component
export default function Home() {
  return (
    <>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>
        <meta
          name='description' 
          content='My personal portfolio including various projects and certifications.'
        />
      </Head>
      <Hero />
    </>
  );
}

// getStaticProps to fetch featured certs, projects, and blog posts
export const getStaticProps = async () => {
  const [featuredCerts, featuredProjects, featuredBlog] = await Promise.all([
    getFeaturedCerts(),
    getFeaturedProjects(),
    getFeaturedBlog(),
  ]);

  return {
    props: {
      featuredCerts,
      featuredProjects,
      featuredBlog,
    },
  };
}
