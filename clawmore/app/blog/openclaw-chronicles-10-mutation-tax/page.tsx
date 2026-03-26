import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Mutation Tax: Sustainable AI Economics',
  description:
    'Value-based pricing for autonomous serverless AI agents. Sustainable economic models powering self-improving agentic infrastructure.',
  slug: 'openclaw-chronicles-10-mutation-tax',
});

export default function BlogPost() {
  return <PostClient />;
}
