import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Surviving the Void: Cross-Lifecycle Memory',
  description:
    'How serverless AI agents remember their purpose when runtimes are destroyed every 15 minutes. S3 + DynamoDB state backbone for agentic systems.',
  slug: 'surviving-void-ephemeral-persistence',
});

export default function BlogPost() {
  return <PostClient />;
}
