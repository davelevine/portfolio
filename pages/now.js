import fs from 'fs/promises'; // Use promises for better async handling
import path from 'path';
import Now from '../components/now/now';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'now', 'now.md');
  const markdownContent = await fs.readFile(filePath, 'utf8'); // Await the promise

  return {
    props: {
      markdownContent,
    },
  };
}

const NowPage = ({ markdownContent }) => <Now markdownContent={markdownContent} />;

export default NowPage;
