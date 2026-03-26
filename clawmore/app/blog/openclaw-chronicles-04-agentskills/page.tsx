import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'AgentSkills: The Standard for Execution',
  description:
    'Moving beyond chat. The modular skill system that allows OpenClaw serverless AI agents to perform real-world actions through AI automation and orchestration.',
  slug: 'openclaw-chronicles-04-agentskills',
});

export default function BlogPost() {
  return <PostClient />;
}
