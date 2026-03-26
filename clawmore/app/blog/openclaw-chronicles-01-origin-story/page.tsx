import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'The Origin Story: From Clawdbot to 250k Stars',
  description:
    "The untold story of OpenClaw's meteoric rise to 250,000 GitHub stars. How a simple openclaw project became the world's leading serverless agentic AI agent platform.",
  slug: 'openclaw-chronicles-01-origin-story',
});

export default function BlogPost() {
  return <PostClient />;
}
