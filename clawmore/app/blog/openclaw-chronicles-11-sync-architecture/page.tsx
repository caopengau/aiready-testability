import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Sync Architecture: Scaling to a Managed Empire',
  description:
    'Cross-account mutation synchronization. ClawMore manages serverless agent-to-agent collaboration and AI orchestration across thousands of AWS accounts.',
  slug: 'openclaw-chronicles-11-sync-architecture',
});

export default function BlogPost() {
  return <PostClient />;
}
