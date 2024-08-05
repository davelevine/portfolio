import Head from 'next/head';
import { getBlog } from '../../util/blog-util';
import BlogComponent from '../../components/blog/blog'; // Renamed to avoid conflict

// Refactored Blog component to use destructuring directly in the function parameter
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

// Refactored getStaticProps to use async/await for better readability and handling of asynchronous operations
export const getStaticProps = async () => {
  const blog = await getBlog();

  // Ensure that each blog has an id, description, and isFeatured before passing to the component
  const validBlog = blog.map(blog => ({
    ...blog,
    id: blog.id || 'default-id', // Ensure each blog has an id
    description: blog.description || 'No description available', // Ensure each blog has a description
    isFeatured: blog.isFeatured !== undefined ? blog.isFeatured : false, // Ensure isFeatured is defined
  }));

  return {
    props: {
      blog: validBlog,
    },
  };
};
