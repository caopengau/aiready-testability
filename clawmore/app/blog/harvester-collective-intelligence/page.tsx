import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Harvester: How Your Wins Help Everyone',
  description:
    'Intelligence scales at the speed of the fastest innovator. How individual mutations fuel global agentic swarm evolution through agent-to-agent collaboration.',
  slug: 'harvester-collective-intelligence',
});

export default function BlogPost() {
  return <PostClient />;
}
