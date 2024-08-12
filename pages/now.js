import fs from 'fs';
import path from 'path';
import Now from '../components/now/now';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'now', 'now.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      markdownContent,
    },
  };
}

const NowPage = ({ markdownContent }) => <Now markdownContent={markdownContent} />;

export default NowPage;
