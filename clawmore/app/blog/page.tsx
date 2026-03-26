import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog | ClawMore - Serverless Agentic Insights & AI Orchestration',
  description:
    'Deep dives into serverless agentic systems, openclaw architecture, AI orchestration, AI automation, and the future of agent-to-agent collaboration at ClawMore.',
  keywords: [
    'openclaw',
    'serverless',
    'agentic',
    'agentic swarm',
    'ai agent',
    'ai orchestration',
    'ai automation',
    'agent to agent collaboration',
    'human to agent collaboration',
  ],
  openGraph: {
    title: 'ClawMore Blog - Serverless Agentic Insights & AI Orchestration',
    description:
      'Deep dives into serverless agentic systems, openclaw architecture, AI orchestration, and the future of agent-to-agent collaboration.',
    url: 'https://clawmore.ai/blog',
    images: [
      {
        url: '/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'ClawMore Blog - Agentic Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClawMore Blog - Serverless Agentic Insights & AI Orchestration',
    description:
      'Deep dives into serverless agentic systems, openclaw architecture, AI orchestration, and agent-to-agent collaboration.',
    creator: '@clawmore',
    images: ['/og-blog.png'],
  },
  alternates: {
    canonical: 'https://clawmore.ai/blog',
  },
};

export default function BlogPage() {
  const apiUrl = process.env.LEAD_API_URL || '';
  return <BlogClient apiUrl={apiUrl} />;
}
