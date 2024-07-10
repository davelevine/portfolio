import Head from 'next/head';
import { getAllProjects } from '../../util/projects-util';
import AllProjects from '../../components/projects/allProjects';

// Refactored Projects component to use destructuring directly in the function parameter
const Projects = ({ projects }) => {
  // Ensure that each project has an id before passing to AllProjects
  const validProjects = projects.map(project => ({
    ...project,
    id: project.id || 'default-id', // Ensure each project has an id
  }));

  return (
    <>
      <Head>
        <title>Projects</title>
        <meta
          name='description'
          content='List of all of my projects.'
        />
      </Head>
      <AllProjects projects={validProjects} />
    </>
  );
};
export default Projects;

// Refactored getStaticProps to use async/await for better readability and handling of asynchronous operations
export const getStaticProps = async () => {
  const allProjects = await getAllProjects();

  // Ensure that each project has an id before passing to the component
  const validProjects = allProjects.map(project => ({
    ...project,
    id: project.id || 'default-id', // Ensure each project has an id
  }));

  return {
    props: {
      projects: validProjects,
    },
  };
};
