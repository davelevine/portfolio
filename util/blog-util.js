import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'data/posts');

// Using implicit return for brevity
export const getBlogFiles = async () => fs.readdir(blogDirectory);

// Helper function to construct file path
const getFilePath = (blogSlug) => path.join(blogDirectory, `${blogSlug}.md`);

export const getBlogData = async (blogIdentifier) => {
  const blogSlug = blogIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = getFilePath(blogSlug); // Reused helper function
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Calculate reading time based on content length
  const readingTime = Math.ceil(content.split(' ').length / 200); // Assuming average reading speed of 200 words per minute

  return {
    slug: blogSlug,
    id: data.id || blogSlug, // Ensure each blog has an id
    ...data,
    readingTime, // Pass the calculated reading time as part of the metadata
    // The full content is still available for the blog detail page but won't be passed to the index page
    content,
  };
};

// Using array destructuring and implicit return
export const getBlog = async () => {
  const blogFiles = await getBlogFiles();
  const blogData = await Promise.all(blogFiles.map(getBlogData));
  return blogData.sort((blogA, blogB) => (new Date(blogB.date) - new Date(blogA.date))); // Ensure date comparison is correct
};

// Using implicit return and arrow function
export const getFeaturedBlog = async () => {
  const blog = await getBlog();
  return blog.filter(blog => blog.isFeatured);
};
