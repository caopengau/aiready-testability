import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Ironclad Autonomy: Security & VPC Isolation',
  description:
    "Safety guards for autonomous serverless agentic systems. Multi-layered recursion guards and VPC isolation in ClawMore's AI orchestration platform.",
  slug: 'openclaw-chronicles-08-security',
});

export default function BlogPost() {
  return <PostClient />;
}
