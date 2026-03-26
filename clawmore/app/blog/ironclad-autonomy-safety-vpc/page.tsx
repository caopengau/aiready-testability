import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Ironclad Autonomy: Safety & VPCs',
  description:
    "Multi-layered security for autonomous serverless AI agents. Context isolation and safety guards in ClawMore's agentic swarm platform.",
  slug: 'ironclad-autonomy-safety-vpc',
});

export default function BlogPost() {
  return <PostClient />;
}
