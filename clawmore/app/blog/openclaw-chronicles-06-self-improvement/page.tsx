import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Self-Improvement: When Agents Write Their Own Skills',
  description:
    'The Molt mechanism. How OpenClaw serverless AI agents autonomously code new skills through AI automation, expanding capabilities via agent-to-agent collaboration.',
  slug: 'openclaw-chronicles-06-self-improvement',
});

export default function BlogPost() {
  return <PostClient />;
}
