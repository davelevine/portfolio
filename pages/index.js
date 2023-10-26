import Head from 'next/head';
import Hero from '../components/home/hero';
import About from '../components/about/about';
import { getFeaturedPosts } from '../util/posts-util';
import { getFeaturedProjects } from '../util/projects-util';

// TODO: Rename 'posts' to 'featuredPosts' for clarity

export default function Home(props) {
  return (
    <>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>
        <meta
          name='Portfolio'
          content='Dave Levine Solutions Engineer Portfolio'
        />
      </Head>
      <Hero />
      <About />
    </>
  );
}

export const getStaticProps = () => {
  const featuredPosts = getFeaturedPosts(); // Fetch featured posts
  const featuredProjects = getFeaturedProjects(); // Fetch featured projects

  return {
    props: {
      posts: featuredPosts, // Pass the featured posts to the component
      featuredProjects: featuredProjects, // Pass the featured projects to the component
    },
  };
}
