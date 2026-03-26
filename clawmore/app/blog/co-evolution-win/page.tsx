import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Co-Evolution: When Everyone Wins',
  description:
    'The network effect of shared intelligence. How multi-human multi-agent collaboration creates exponential value in serverless agentic swarm systems.',
  slug: 'co-evolution-win',
});

export default function BlogPost() {
  return <PostClient />;
}
