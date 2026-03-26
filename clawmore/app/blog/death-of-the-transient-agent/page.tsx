import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Death of the Transient Agent',
  description:
    'Why stateless chat with infrastructure is a dead end. The case for mutable logic state in serverless agentic AI systems that persists to source control.',
  slug: 'death-of-the-transient-agent',
});

export default function BlogPost() {
  return <PostClient />;
}
