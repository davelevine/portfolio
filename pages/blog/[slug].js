import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getBlogData, getBlogFiles } from '../../util/blog-util';
import classes from '../../components/blog/blogContent.module.scss';

// Dynamically import BlogContent for code splitting with a more efficient loading strategy
const BlogContent = dynamic(() => import('../../components/blog/blogContent'), {
  loading: () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={classes.spinner}
    />
  ),
  ssr: false, // Disable server-side rendering for this component to improve performance
});

// BlogDetailPage component with early return for better performance
const BlogDetailPage = ({ blog, currentTheme }) => {
  if (!blog) {
    return <p>Blog not found.</p>;
  }

  const { title, description } = blog; // Destructure to avoid multiple accesses

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description || 'No description available'} />
      </Head>
      <BlogContent blog={blog} currentTheme={currentTheme} />
    </>
  );
};

// Optimized getStaticProps with early return for better performance
export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const blogData = await getBlogData(slug);

  if (!blogData) {
    return { notFound: true };
  }

  const { id = 'default-id', content = '' } = blogData; // Destructure with defaults

  return {
    props: {
      blog: { ...blogData, id, content },
    },
    revalidate: 600,
  };
};

// Optimized getStaticPaths for better performance
export const getStaticPaths = async () => {
  const blogFilenames = await getBlogFiles();
  const paths = blogFilenames.map((fileName) => ({
    params: { slug: fileName.replace(/\.md$/, '') },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default BlogDetailPage;
