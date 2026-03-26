import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Infrastructure as Code: CDK Monorepo Mastery',
  description:
    'Organizing complex serverless AI agent infrastructure into a single deployable blueprint. AWS CDK and npm workspaces for agentic systems.',
  slug: 'cdk-monorepo-mastery',
});

export default function BlogPost() {
  return <PostClient />;
}
