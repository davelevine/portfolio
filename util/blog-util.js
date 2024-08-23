import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'data/posts');

let fs;
if (typeof window === 'undefined') {
  // Only import 'fs/promises' on the server
  fs = require('fs/promises');
}

export const getBlogFiles = async () => {
  if (!fs) return []; // Return an empty array if fs is not available (client-side)
  return fs.readdir(blogDirectory);
};

const getFilePath = (blogSlug) => path.join(blogDirectory, `${blogSlug}.md`);

export const getBlogData = async (blogIdentifier) => {
  const blogSlug = blogIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = getFilePath(blogSlug); // Reused helper function
  if (!fs) return null; // Return null if fs is not available (client-side)
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Calculate reading time based on content length
  const readingTime = Math.ceil(content.split(/\s+/).length / 200); // Using regex to split by whitespace for better performance

  return {
    slug: blogSlug,
    id: data.id || blogSlug, // Ensure each blog has an id
    ...data,
    readingTime, // Pass the calculated reading time as part of the metadata
    content, // The full content is still available for the blog detail page but won't be passed to the index page
  };
};

export const getBlog = async () => {
  if (!fs) return []; // Return an empty array if fs is not available (client-side)
  const blogFiles = await getBlogFiles();
  const blogDataPromises = blogFiles.map(getBlogData); // Store promises to avoid multiple await calls
  const blogData = await Promise.all(blogDataPromises);
  return blogData.sort((blogA, blogB) => new Date(blogB.date) - new Date(blogA.date)); // Ensure date comparison is correct
};

export const getFeaturedBlog = async () => {
  const blog = await getBlog();
  return blog.filter(({ isFeatured }) => isFeatured); // Destructure for better performance
};
