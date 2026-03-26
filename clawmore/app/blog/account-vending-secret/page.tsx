import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Account Vending Secret',
  description:
    'How AWS account vending enables secure isolation for autonomous serverless AI agents. Agentic infrastructure with zero-trust boundaries.',
  slug: 'account-vending-secret',
});

export default function BlogPost() {
  return <PostClient />;
}
