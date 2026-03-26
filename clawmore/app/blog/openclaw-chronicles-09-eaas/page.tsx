import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Evolution-as-a-Service: Managed Hub-and-Spoke',
  description:
    "The architecture of managed evolution. ClawMore's Hub-and-Spoke pattern for serverless agentic swarm AI orchestration across AWS accounts.",
  slug: 'openclaw-chronicles-09-eaas',
});

export default function BlogPost() {
  return <PostClient />;
}
