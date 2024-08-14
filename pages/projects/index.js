import Head from 'next/head';
import { getAllProjects } from '../../util/projects-util';
import AllProjects from '../../components/projects/allProjects';

// Projects component to display all projects
const Projects = ({ projects }) => {
  // Use a fallback UI for better performance
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
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

  // Return 404 if no projects are found
  if (!allProjects || !Array.isArray(allProjects)) {
    return {
      notFound: true,
    };
  }

  // Ensure that each project has an id before passing to the component
  const validProjects = allProjects.map(({ id = 'default-id', ...project }) => ({
    ...project,
    id,
  }));

  return {
    props: {
      projects: validProjects,
    },
    revalidate: 600, // Incremental Static Regeneration for better performance
  };
};