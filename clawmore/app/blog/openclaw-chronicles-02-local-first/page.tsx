import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'OpenClaw 101: The Local-First Philosophy',
  description:
    'Why privacy and performance are the pillars of the next generation of serverless AI agents. The simple openclaw approach to local-first agentic systems.',
  slug: 'openclaw-chronicles-02-local-first',
});

export default function BlogPost() {
  return <PostClient />;
}
