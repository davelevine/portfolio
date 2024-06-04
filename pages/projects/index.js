import Head from 'next/head';
import { getAllProjects } from '../../util/projects-util';
import AllProjects from '../../components/projects/allProjects';

// Refactored Projects component to use destructuring directly in the function parameter
const Projects = ({ projects }) => {
  return (
    <>
      <Head>
        <title>Projects</title>
        <meta
          name='description'
          content='List of all of my projects. Tech-Stack: React, Next.js, Redux, Typescript, Node.js, Express, MongoDB, Bootstrap, Shopware.'
        />
      </Head>
      <AllProjects projects={projects} />
    </>
  );
};
export default Projects;

// Refactored getStaticProps to use async/await for better readability and handling of asynchronous operations
export const getStaticProps = async () => {
  const allProjects = await getAllProjects();

  return {
    props: {
      projects: allProjects,
    },
  };
};
