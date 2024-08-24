import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const certsDirectory = path.join(process.cwd(), 'data/certs');

export const getCertsFiles = async () => await fs.readdir(certsDirectory);

const getFilePath = (certSlug) => path.join(certsDirectory, `${certSlug}.md`);

export const getCertData = async (certIdentifier) => {
  const certSlug = certIdentifier.replace(/\.md$/, '');
  const filePath = getFilePath(certSlug);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug: certSlug,
    ...data,
    content,
  };
};

export const getAllCerts = async () => {
  const certFiles = await getCertsFiles();
  const certsData = await Promise.all(certFiles.map(getCertData));
  return certsData.sort((certA, certB) => new Date(certB.achievedDate) - new Date(certA.achievedDate));
};

export const getFeaturedCerts = async () => {
  const allCerts = await getAllCerts();
  return allCerts.filter(cert => cert.isFeatured);
};
