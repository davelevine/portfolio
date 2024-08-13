import Head from 'next/head';
import { getBlog } from '../../util/blog-util';
import BlogComponent from '../../components/blog/blog'; // Renamed to avoid conflict

// Blog component using destructuring directly in the function parameter
const Blog = ({ blog }) => {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta
          name='description'
          content='List of all content from my blog.'
        />
      </Head>
      <BlogComponent blog={blog} /> {/* Updated to use the renamed component */}
    </>
  );
};
export default Blog;

// getStaticProps using async/await for better readability and handling of asynchronous operations
export const getStaticProps = async () => {
  const blog = await getBlog();

  // Ensure that each blog has an id, description, and isFeatured before passing to the component
  const validBlog = blog.map(item => ({
    ...item,
    id: item.id || 'default-id', // Ensure each blog has an id
    description: item.description || 'No description available', // Ensure each blog has a description
    isFeatured: item.isFeatured !== undefined ? item.isFeatured : false, // Ensure isFeatured is defined
  }));

  return {
    props: {
      blog: validBlog,
    },
  };
};
