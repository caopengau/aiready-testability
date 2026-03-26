import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Great Decoupling: Part 1 - Auditing the Monolith',
  description:
    'How to audit a legacy repository for serverless agentic readiness. Identifying the Wall before your AI agent hits it.',
  slug: 'the-great-decoupling-01-audit',
});

export default function BlogPost() {
  return <PostClient />;
}
