// util/rss.js
import RSS from 'rss';
import { getBlog } from './blog-util'; // Adjust the path as needed
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export async function generateRSS() {
  const feed = new RSS({
    title: "Dave's Blog",
    description: "Latest posts from Dave Levine's blog.",
    site_url: 'https://dave.levine.io',
    feed_url: 'https://dave.levine.io/rss.xml',
    language: 'en',
    image_url: 'https://cdn.levine.io/uploads/portfolio/public/images/favicon/favicon.ico',
    favicon: 'https://cdn.levine.io/uploads/portfolio/public/images/favicon/favicon.ico',
    copyright: 'All rights reserved 2024, Dave Levine',
    pubDate: new Date().toUTCString(),
    ttl: 60,
    generator: "Dave's Blog RSS Feed",
  });

  const posts = await getBlog();

  posts.forEach((post) => {
    const description = marked(post.content);

    feed.item({
      title: post.title,
      url: `https://dave.levine.io/blog/${post.slug}`,
      description,
      author: 'Dave Levine',
      date: new Date(post.date),
    });
  });

  const rss = feed.xml({ indent: true });

  // Save the RSS file in the public directory (for access via /rss.xml)
  const rssPath = path.join(process.cwd(), 'public', 'rss.xml');
  fs.writeFileSync(rssPath, rss);

  console.log('RSS feed generated successfully!');
}
