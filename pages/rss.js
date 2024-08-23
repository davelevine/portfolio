import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RSSPage() {
  const router = useRouter();

  useEffect(() => {
    // Perform client-side redirect to /rss.xml
    router.replace('/rss.xml');
  }, [router]);

  return null; // Render nothing
}
