import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const certsDirectory = path.join(process.cwd(), 'data/certs');

// Refactored to use arrow function with implicit return for brevity
export const getCertsFiles = async () => await fs.readdir(certsDirectory);

// Refactored to extract common logic into a helper function
const getFilePath = (certSlug) => path.join(certsDirectory, `${certSlug}.md`);

export const getCertData = async (certIdentifier) => {
  const certSlug = certIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = getFilePath(certSlug); // Reused helper function
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug: certSlug,
    ...data,
    content,
  };
};

// Refactored to use array destructuring and implicit return
export const getAllCerts = async () => {
  const certFiles = await getCertsFiles();
  const certsData = await Promise.all(certFiles.map(getCertData));
  return certsData.sort((certA, certB) => (certA.date > certB.date ? -1 : 1));
};

// Refactored to use implicit return and arrow function
export const getFeaturedCerts = async () => {
  const allCerts = await getAllCerts();
  return allCerts.filter(cert => cert.isFeatured);
};
