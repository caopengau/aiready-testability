import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Reflector: Machines that Self-Critique',
  description:
    "Serverless AI agents that find their own bugs. Autonomous Gap Detection Loops in ClawMore's agentic swarm for human-to-agent collaboration.",
  slug: 'the-reflector-self-critique',
});

export default function BlogPost() {
  return <PostClient />;
}
