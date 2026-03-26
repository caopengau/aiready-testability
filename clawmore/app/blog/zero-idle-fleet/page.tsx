import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Zero-Idle Fleet: Scaling to Infinity for $0.00',
  description:
    'How serverless agentic systems achieve infinite scale at zero idle cost. AI orchestration that only runs when needed.',
  slug: 'zero-idle-fleet',
});

export default function BlogPost() {
  return <PostClient />;
}
