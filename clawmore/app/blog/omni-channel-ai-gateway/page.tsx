import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Omni-Channel Command: One Agent, Six Interfaces',
  description:
    'Integrating Telegram, Discord, Slack, and iMessage into a unified serverless AI orchestration spine. A multi-platform AI agent that never misses a pulse.',
  slug: 'omni-channel-ai-gateway',
});

export default function BlogPost() {
  return <PostClient />;
}
