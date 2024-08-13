import Head from 'next/head';
import { getAllProjects } from '../../util/projects-util';
import AllProjects from '../../components/projects/allProjects';

// Projects component to display all projects
const Projects = ({ projects }) => {
  // Ensure projects is defined and is an array before rendering
  if (!projects || !Array.isArray(projects)) {
    return <p>No projects found.</p>; // Handle case where no projects are available
  }

  return (
    <>
      <Head>
        <title>Projects</title>
        <meta
          name='description'
          content='List of all of my projects.'
        />
      </Head>
      <AllProjects projects={projects} />
    </>
  );
};
export default Projects;

// getStaticProps to fetch all projects
export const getStaticProps = async () => {
  const allProjects = await getAllProjects();

  // Ensure allProjects is valid before processing
  if (!allProjects) {
    return {
      notFound: true, // Return 404 if no projects are found
    };
  }

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
