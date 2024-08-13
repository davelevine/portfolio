import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getBlogData, getBlogFiles } from '../../util/blog-util'; // Updated import path
import classes from '../../components/blog/blogContent.module.scss';

// Dynamically import BlogContent for code splitting
const BlogContent = dynamic(() => import('../../components/blog/blogContent'), {
  loading: () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={classes.spinner}
    />
  ),
});

// Refactored BlogDetailPage to use destructuring directly in the function parameter for cleaner code
const BlogDetailPage = ({ blog, currentTheme }) => {
  if (!blog) {
    return <p>Blog not found.</p>; // Handle case where blog data is not available
  }

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name='description' content={blog.description || 'No description available'} /> {/* Fallback description */}
      </Head>
      <BlogContent blog={blog} currentTheme={currentTheme} />
    </>
  );
};

// Refactored getStaticProps to use async/await for better readability and handling of asynchronous operations
export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const blogData = await getBlogData(slug); // This will now fetch full content when needed

  if (!blogData) {
    return {
      notFound: true, // Return 404 if blog data is not found
    };
  }

  return {
    props: {
      blog: {
        ...blogData,
        id: blogData.id || 'default-id', // Ensure the blog has an id
        content: blogData.content || '', // Ensure content is provided here
      },
    },
    revalidate: 600,
  };
};

// Refactored getStaticPaths to use async/await for better readability and handling of asynchronous operations
export const getStaticPaths = async () => {
  const blogFilenames = await getBlogFiles();
  const slugs = blogFilenames.map((fileName) =>
    fileName.replace(/\.md$/, '')
  );

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export default BlogDetailPage;
