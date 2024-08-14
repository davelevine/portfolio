import Head from 'next/head';
import { getBlog } from '../../util/blog-util';
import BlogComponent from '../../components/blog/blog'; // Ensure this component is correctly imported

// Blog component using destructuring directly in the function parameter
const Blog = ({ blog }) => {
  if (!blog) {
    return <p>No blog data available.</p>; // Handle case where blog data is undefined
  }

  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name='description' content='List of all content from my blog.' />
      </Head>
      <BlogComponent blog={blog} /> {/* Updated to use the renamed component */}
    </>
  );
};

export default Blog;

// getStaticProps using async/await for better readability and handling of asynchronous operations
export const getStaticProps = async () => {
  const blog = await getBlog();

  // Only pass necessary data for rendering the blog list
  const minimalBlogData = blog.map(({ id = 'default-id', title, description = 'No description available', date, categories, slug, isFeatured = false, readingTime }) => ({
    id,
    title,
    description,
    date,
    categories,
    slug,
    isFeatured,
    readingTime, // Pass the calculated reading time
  }));

  return {
    props: {
      blog: minimalBlogData,
    },
    revalidate: 600, // Add revalidation for better performance
  };
};
