import { useEffect } from 'react';
import { generateRSS } from '../util/rss';

export async function getStaticProps() {
  await generateRSS();
  return { props: {} };
}

export default function RSSPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/rss.xml";
    }
  }, []);

  return null; // Render nothing as the redirect will happen immediately
}
