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
        <title>Personal Portfolio</title>
        <meta
          name='description'
          content='My personal web development portfolio including various frontend and fullstack projects as well as web development blog articles. Tech-Stack: React, Next.js, Redux, Typescript, Node.js, Express, MongoDB, Bootstrap, Shopware.'
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
