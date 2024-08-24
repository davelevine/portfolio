import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'data/projects');

export const getProjectsFiles = async () => await fs.readdir(projectsDirectory);

const getFilePath = (projectSlug) => path.join(projectsDirectory, `${projectSlug}.md`);

export const getProjectData = async (projectIdentifier) => {
  const projectSlug = projectIdentifier.replace(/\.md$/, '');
  const filePath = getFilePath(projectSlug);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug: projectSlug,
    id: data.id || projectSlug,
    ...data,
    content,
  };
};

export const getAllProjects = async () => {
  const projectsFiles = await getProjectsFiles();
  const projectsData = await Promise.all(projectsFiles.map(getProjectData));
  return projectsData.sort((projectA, projectB) => (projectA.date > projectB.date ? -1 : 1));
};

export const getFeaturedProjects = async () => {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => project.isFeatured);
};

export const preloadProjectImages = (projects) => {
  projects.forEach(project => {
    if (project.image) {
      const imageSrc = `https://cdn.levine.io/uploads/portfolio/public/images/projects/${project.image}`;
      return imageSrc;
    }
  });
};
