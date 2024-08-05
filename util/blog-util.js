import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'data/posts');

// Refactored to use arrow function with implicit return for brevity
export const getBlogFiles = async () => await fs.readdir(blogDirectory);

// Refactored to extract common logic into a helper function
const getFilePath = (bloglug) => path.join(blogDirectory, `${bloglug}.md`);

export const getBlogData = async (blogIdentifier) => {
  const bloglug = blogIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = getFilePath(bloglug); // Reused helper function
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug: bloglug,
    id: data.id || bloglug, // Ensure each blog has an id
    ...data,
    content,
  };
};

// Refactored to use array destructuring and implicit return
export const getBlog = async () => {
  const blogFiles = await getBlogFiles();
  const blogData = await Promise.all(blogFiles.map(getBlogData));
  return blogData.sort((blogA, blogB) => (blogA.date > blogB.date ? -1 : 1));
};

// Refactored to use implicit return and arrow function
export const getFeaturedBlog = async () => {
  const blog = await getBlog();
  return blog.filter(blog => blog.isFeatured);
};
