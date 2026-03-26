import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Mutation #001: The SMB Agentic Swarm',
  description:
    'How a .00 refactor enabled a small firm to deploy a serverless intelligent agentic swarm. Simple openclaw deployment for multi-human multi-agent collaboration.',
  slug: 'mutation-001-smb-swarm',
});

export default function BlogPost() {
  return <PostClient />;
}
