import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getProjectData, getProjectsFiles } from '../../util/projects-util';
import classes from '../../components/projects/projectContent.module.scss';

// Dynamically import ProjectContent for code splitting
const ProjectContent = dynamic(() => import('../../components/projects/projectContent'), {
  loading: () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={classes.spinner}
    />
  ),
});

// ProjectDetailPage component to display project details
const ProjectDetailPage = ({ project, currentTheme }) => {
  if (!project) {
    return <p>Project not found.</p>; // Handle case where project data is not available
  }

  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name='description' content={project.description || 'No description available'} /> {/* Fallback description */}
      </Head>
      <ProjectContent project={project} currentTheme={currentTheme} />
    </>
  );
};

// getStaticProps to fetch project data
export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const projectData = await getProjectData(slug);

  if (!projectData) {
    return {
      notFound: true, // Return 404 if project data is not found
    };
  }

  return {
    props: {
      project: {
        ...projectData,
        id: projectData.id || 'default-id', // Ensure the project has an id
      },
    },
    revalidate: 600,
  };
};

// getStaticPaths to fetch all project slugs
export const getStaticPaths = async () => {
  const projectsFilenames = await getProjectsFiles();
  const slugs = projectsFilenames.map((fileName) =>
    fileName.replace(/\.md$/, '')
  );

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export default ProjectDetailPage;
