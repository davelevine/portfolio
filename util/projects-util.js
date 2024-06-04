import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'data/projects');

// Refactored to use arrow function with implicit return for brevity
export const getProjectsFiles = () => fs.readdirSync(projectsDirectory);

// Refactored to extract common logic into a helper function
const getFilePath = (projectSlug) => path.join(projectsDirectory, `${projectSlug}.md`);

export const getProjectData = (projectIdentifier) => {
  const projectSlug = projectIdentifier.replace(/\.md$/, ''); // removes the file extension
  const filePath = getFilePath(projectSlug); // Reused helper function
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug: projectSlug,
    ...data,
    content,
  };
};

// Refactored to use array destructuring and implicit return
export const getAllProjects = () => {
  const projectsFiles = getProjectsFiles();
  return projectsFiles
    .map(getProjectData)
    .sort((projectA, projectB) => (projectA.date > projectB.date ? -1 : 1));
};

// Refactored to use implicit return and arrow function
export const getFeaturedProjects = () => getAllProjects().filter(project => project.isFeatured);
