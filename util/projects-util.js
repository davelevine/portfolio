import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'data/projects');

// Refactored to use arrow function with implicit return for brevity
export const getProjectsFiles = async () => await fs.readdir(projectsDirectory);

// Refactored to extract common logic into a helper function
const getFilePath = (projectSlug) => path.join(projectsDirectory, `${projectSlug}.md`);

export const getProjectData = async (projectIdentifier) => {
  const projectSlug = projectIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = getFilePath(projectSlug); // Reused helper function
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug: projectSlug,
    id: data.id || projectSlug, // Ensure each project has an id
    ...data,
    content,
  };
};

// Refactored to use array destructuring and implicit return
export const getAllProjects = async () => {
  const projectsFiles = await getProjectsFiles();
  const projectsData = await Promise.all(projectsFiles.map(getProjectData));
  return projectsData.sort((projectA, projectB) => (projectA.date > projectB.date ? -1 : 1));
};

// Refactored to use implicit return and arrow function
export const getFeaturedProjects = async () => {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => project.isFeatured);
};
