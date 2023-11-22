import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const certsDirectory = path.join(process.cwd(), 'data/certs');

export const getCertsFiles = () => {
  return fs.readdirSync(certsDirectory);
};

export const getCertData = (certIdentifier) => {
  const certSlug = certIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = path.join(certsDirectory, `${certSlug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const certData = {
    slug: certSlug,
    ...data,
    content,
  };

  return certData;
};

export const getAllCerts = () => {
  const certFiles = getCertsFiles();

  const allCerts = certFiles.map((certFile) => {
    return getCertData(certFile);
  });

  const sortedCerts = allCerts.sort((certA, certB) =>
    certA.date > certB.date ? -1 : 1
  );

  return sortedCerts;
};

export const getFeaturedCerts = () => {
  const allCerts = getAllCerts();

  const featuredCerts = allCerts.filter((cert) => cert.isFeatured);

  return featuredCerts;
};
