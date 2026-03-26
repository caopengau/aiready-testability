import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign In to Your Agentic Swarm Dashboard',
  description:
    'Sign in to ClawMore — your serverless agentic swarm platform. Access AI orchestration, AI automation, and agent-to-agent collaboration tools.',
  openGraph: {
    title: 'Sign In | ClawMore - Agentic Swarm Platform',
    description:
      'Access your ClawMore dashboard. Serverless agentic swarm for AI orchestration and human-to-agent collaboration.',
    url: 'https://clawmore.ai/login',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'ClawMore Sign In - Agentic Swarm Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In | ClawMore - Agentic Swarm Platform',
    description:
      'Access your ClawMore dashboard for AI orchestration and agent collaboration.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://clawmore.ai/login',
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
