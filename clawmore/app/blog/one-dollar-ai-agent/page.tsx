import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The $1/Month AI Agent',
  description:
    'Breaking the 24/7 hosting trap. How to run a serverless multi-channel AI agent backbone for the price of a single coffee using simple openclaw patterns.',
  slug: 'one-dollar-ai-agent',
});

export default function BlogPost() {
  return <PostClient />;
}
