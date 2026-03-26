import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Bridge Pattern: HTTP to WebSocket',
  description:
    'Solving persistent connection in a serverless world. Connecting ephemeral Lambda triggers to long-running AI agent streams for AI automation.',
  slug: 'bridge-pattern-ephemeral-persistent',
});

export default function BlogPost() {
  return <PostClient />;
}
