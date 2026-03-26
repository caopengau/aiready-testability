import { Metadata } from 'next';
import SignupClient from './SignupClient';

export const metadata: Metadata = {
  title: 'Sign Up for Simple One-Click OpenClaw',
  description:
    'Create your free ClawMore account. Start with simple one-click OpenClaw deployment — the agentic swarm platform for AI orchestration, AI automation, and human-to-agent collaboration.',
  openGraph: {
    title: 'Sign Up for Simple One-Click OpenClaw | ClawMore',
    description:
      'Join the agentic swarm. Free tier includes 3 repositories, 10 analysis runs, and $5 AI credit. Simple one-click OpenClaw deployment for AI orchestration.',
    url: 'https://clawmore.ai/signup',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'ClawMore Sign Up - Simple One-Click OpenClaw',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up for Simple One-Click OpenClaw | ClawMore',
    description:
      'Join the agentic swarm. Free tier for AI orchestration and human-to-agent collaboration.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://clawmore.ai/signup',
  },
};

export default function SignupPage() {
  return <SignupClient />;
}
