import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Great Decoupling: Part 3 - The Agentic Protocol',
  description:
    'The final bridge. Wrapping decoupled modules in a universal protocol for maximum serverless AI agent leverage and agent-to-agent collaboration.',
  slug: 'the-great-decoupling-03-protocol',
});

export default function BlogPost() {
  return <PostClient />;
}
