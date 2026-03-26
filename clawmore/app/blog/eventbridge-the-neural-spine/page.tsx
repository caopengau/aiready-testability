import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'EventBridge: The Neural Spine',
  description:
    'Mapping the ClawFlow mesh. How asynchronous events enable serverless agent-to-agent collaboration and AI orchestration without a central controller.',
  slug: 'eventbridge-the-neural-spine',
});

export default function BlogPost() {
  return <PostClient />;
}
