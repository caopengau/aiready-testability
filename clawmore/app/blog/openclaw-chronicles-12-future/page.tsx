import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Future: Beyond the Bridge Pattern',
  description:
    'The roadmap to a Managed Business Empire. The future of fully autonomous serverless agentic systems and multi-human multi-agent collaboration.',
  slug: 'openclaw-chronicles-12-future',
});

export default function BlogPost() {
  return <PostClient />;
}
