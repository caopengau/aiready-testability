import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Persistence: S3 + DynamoDB State Management',
  description:
    'Scaling local-first state to cloud scale. How S3 and DynamoDB provide a persistent backbone for serverless OpenClaw AI agents.',
  slug: 'openclaw-chronicles-07-persistence',
});

export default function BlogPost() {
  return <PostClient />;
}
