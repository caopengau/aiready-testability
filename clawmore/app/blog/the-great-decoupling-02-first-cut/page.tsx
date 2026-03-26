import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Great Decoupling: Part 2 - The First Cut',
  description:
    'From audit to action. Safely decoupling your first module for serverless AI agent discoverability and agentic orchestration.',
  slug: 'the-great-decoupling-02-first-cut',
});

export default function BlogPost() {
  return <PostClient />;
}
