import Head from 'next/head';
import PostContent from '../../components/certs/postContent'; // Update the import path
import { getPostData, getPostsFiles } from '../../util/certs-util'; // Update the import path

const PostDetailPage = (props) => {
  const { post, currentTheme } = props;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name='description' content={post.excerpt} />
      </Head>
      <PostContent post={post} currentTheme={currentTheme} />
    </>
  );
};

export const getStaticProps = (context) => {
  const { params } = context;
  const { slug } = params;
  const postData = getPostData(slug); // Update the function call

  return {
    props: {
      post: postData,
    },
    revalidate: 600,
  };
};

export const getStaticPaths = () => {
  const postFilenames = getPostsFiles(); // Update the function call
  const slugs = postFilenames.map((fileName) => fileName.replace(/\.md$/, ''));

  return {
    paths: slugs.map((slug) => ({ params: { slug: slug } })),
    fallback: false,
  };
};

export default PostDetailPage;
