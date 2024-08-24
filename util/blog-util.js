import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'data/posts');

let fs;
if (typeof window === 'undefined') {
  fs = require('fs/promises');
}

export const getBlogFiles = async () => {
  if (!fs) return [];
  return fs.readdir(blogDirectory);
};

const getFilePath = (blogSlug) => path.join(blogDirectory, `${blogSlug}.md`);

export const getBlogData = async (blogIdentifier) => {
  const blogSlug = blogIdentifier.replace(/\.md$/, '');
  const filePath = getFilePath(blogSlug);
  if (!fs) return null;
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const readingTime = Math.ceil(content.split(/\s+/).length / 200);

  return {
    slug: blogSlug,
    id: data.id || blogSlug,
    ...data,
    readingTime,
    content,
  };
};

export const getBlog = async () => {
  if (!fs) return [];
  const blogFiles = await getBlogFiles();
  const blogDataPromises = blogFiles.map(getBlogData);
  const blogData = await Promise.all(blogDataPromises);
  return blogData.sort((blogA, blogB) => new Date(blogB.date) - new Date(blogA.date));
};

export const getFeaturedBlog = async () => {
  const blog = await getBlog();
  return blog.filter(({ isFeatured }) => isFeatured);
};
