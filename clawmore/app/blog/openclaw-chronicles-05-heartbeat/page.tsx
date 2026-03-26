import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Heartbeat: Scheduling Proactive Intelligence',
  description:
    'Moving from reactive chat to proactive assistance. How OpenClaw serverless agents wake up for human-to-agent collaboration without being prompted.',
  slug: 'openclaw-chronicles-05-heartbeat',
});

export default function BlogPost() {
  return <PostClient />;
}
