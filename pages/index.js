import Head from 'next/head';
import Hero from '../components/home/hero';
import About from '../components/about/about';
import { getFeaturedPosts } from '../util/posts-util';
import { getFeaturedProjects } from '../util/projects-util';

// TODO: rename posts to featuredPosts

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
  const featuredPosts = getFeaturedPosts();
  const featuredProjects = getFeaturedProjects();

  return {
    props: {
      posts: featuredPosts,
      featuredProjects: featuredProjects,
    },
  };
};
