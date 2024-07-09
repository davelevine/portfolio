import Head from 'next/head';
import ProjectContent from '../../components/projects/projectContent';
import { getProjectData, getProjectsFiles } from '../../util/projects-util';

// Refactored ProjectDetailPage to use destructuring directly in the function parameter for cleaner code
const ProjectDetailPage = ({ project, currentTheme }) => {
  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name='description' content={project.description} />
      </Head>
      <ProjectContent project={project} currentTheme={currentTheme} />
    </>
  );
};

// Refactored getStaticProps to use async/await for better readability and handling of asynchronous operations
export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const projectData = await getProjectData(slug);

  // Ensure the project has an id
  const validProjectData = {
    ...projectData,
    id: projectData.id || 'default-id',
  };

  return {
    props: {
      project: validProjectData,
    },
    revalidate: 600,
  };
};

// Refactored getStaticPaths to use async/await for better readability and handling of asynchronous operations
export const getStaticPaths = async () => {
  const projectsFilenames = await getProjectsFiles();
  const slugs = projectsFilenames.map((fileName) =>
    fileName.replace(/\.md$/, '')
  );

  return {
    paths: slugs.map((slug) => ({ params: { slug } })), // Simplified object property shorthand
    fallback: false,
  };
};

export default ProjectDetailPage;
