import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: "The Message Router: OpenClaw's Neural Spine",
  description:
    'One agent, infinite channels. How OpenClaw unified WhatsApp, Discord, and Slack into a single serverless AI orchestration backbone for agent-to-agent collaboration.',
  slug: 'openclaw-chronicles-03-neural-spine',
});

export default function BlogPost() {
  return <PostClient />;
}
