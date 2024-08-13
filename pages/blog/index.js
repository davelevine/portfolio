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

  // Only pass necessary data for rendering the blog list
  const minimalBlogData = blog.map(({ id, title, description, date, categories, slug, isFeatured, readingTime }) => ({
    id: id || 'default-id', // Ensure each blog has an id
    title,
    description: description || 'No description available', // Ensure each blog has a description
    date,
    categories,
    slug,
    isFeatured: isFeatured !== undefined ? isFeatured : false, // Ensure isFeatured is defined
    readingTime, // Pass the calculated reading time
  }));

  return {
    props: {
      blog: minimalBlogData,
    },
  };
};
