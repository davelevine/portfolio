import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const certsDirectory = path.join(process.cwd(), 'data/certs');

// Use a single read operation to improve performance
export const getCertsFiles = async () => {
  try {
    return await fs.readdir(certsDirectory);
  } catch (error) {
    console.error('Error reading certs directory:', error);
    return []; // Return an empty array on error
  }
};

const getFilePath = (certSlug) => path.join(certsDirectory, `${certSlug}.md`);

export const getCertData = async (certIdentifier) => {
  const certSlug = certIdentifier.replace(/\.md$/, '');
  const filePath = getFilePath(certSlug);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug: certSlug,
      ...data,
      content,
    };
  } catch (error) {
    console.error(`Error reading cert file ${filePath}:`, error);
    return null; // Return null if there's an error reading the file
  }
};

export const getAllCerts = async () => {
  const certFiles = await getCertsFiles();
  const certsData = await Promise.all(certFiles.map(getCertData));

  // Filter out any null results from getCertData
  const validCertsData = certsData.filter(cert => cert !== null);

  return validCertsData.sort((certA, certB) => new Date(certB.achievedDate) - new Date(certA.achievedDate));
};

export const getFeaturedCerts = async () => {
  const allCerts = await getAllCerts();
  return allCerts.filter(cert => cert.isFeatured);
};