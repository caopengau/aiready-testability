import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Why $0 Idle is the Only Way to Scale',
  description:
    'The economics of the serverless agentic era require a shift from uptime to on-demand AI automation. Scaling for AI agent infrastructure.',
  slug: 'zero-idle-scaling',
});

export default function BlogPost() {
  return <PostClient />;
}
