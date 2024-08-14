import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'data/projects');

// Use a single read operation to improve performance
export const getProjectsFiles = async () => {
  try {
    return await fs.readdir(projectsDirectory);
  } catch (error) {
    console.error('Error reading projects directory:', error);
    return []; // Return an empty array on error
  }
};

const getFilePath = (projectSlug) => path.join(projectsDirectory, `${projectSlug}.md`);

export const getProjectData = async (projectIdentifier) => {
  const projectSlug = projectIdentifier.replace(/\.md$/, '');
  const filePath = getFilePath(projectSlug);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug: projectSlug,
      id: data.id || projectSlug,
      ...data,
      content,
    };
  } catch (error) {
    console.error(`Error reading project file ${filePath}:`, error);
    return null; // Return null if there's an error reading the file
  }
};

export const getAllProjects = async () => {
  const projectsFiles = await getProjectsFiles();
  const projectsData = await Promise.all(projectsFiles.map(getProjectData));
  
  // Filter out any null results from getProjectData
  return projectsData.filter(project => project !== null).sort((projectA, projectB) => (projectA.date > projectB.date ? -1 : 1));
};

export const getFeaturedProjects = async () => {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => project.isFeatured);
};