import Head from 'next/head';
import { getAllPosts } from '../../util/certs-util';
import AllPosts from '../../components/certs/allPosts';

const Posts = (props) => {
  const { posts } = props;

  return (
    <>
      <Head>
        <title>Certifications</title>
        <meta
          name='description'
          content='List of all my certifications.'
        />
      </Head>
      <AllPosts posts={posts} />
    </>
  );
};
export default Posts;

export const getStaticProps = (context) => {
  const allPosts = getAllPosts();

  return {
    props: {
      posts: allPosts,
    },
  };
};
