import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'SST Ion & The Coder Loop',
  description:
    'Closing the gap between LLM reasoning and Pulumi-based deployment. Sub-second infrastructure mutations through serverless AI automation and orchestration.',
  slug: 'sst-ion-coder-loop',
});

export default function BlogPost() {
  return <PostClient />;
}
