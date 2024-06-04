import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const certsDirectory = path.join(process.cwd(), 'data/certs');

// Refactored to use arrow function with implicit return for brevity
export const getCertsFiles = () => fs.readdirSync(certsDirectory);

// Refactored to extract common logic into a helper function
const getFilePath = (certSlug) => path.join(certsDirectory, `${certSlug}.md`);

export const getCertData = (certIdentifier) => {
  const certSlug = certIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = getFilePath(certSlug); // Reused helper function
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug: certSlug,
    ...data,
    content,
  };
};

// Refactored to use array destructuring and implicit return
export const getAllCerts = () => {
  const certFiles = getCertsFiles();
  return certFiles
    .map(getCertData)
    .sort((certA, certB) => (certA.date > certB.date ? -1 : 1));
};

// Refactored to use implicit return and arrow function
export const getFeaturedCerts = () => getAllCerts().filter(cert => cert.isFeatured);
