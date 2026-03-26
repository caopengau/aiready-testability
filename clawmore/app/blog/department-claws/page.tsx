import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Department Claws: Specialized Agent Teams',
  description:
    'Organizing serverless AI agents into specialized departments. HR, Finance, CRM, and DevOps through multi-human multi-agent collaboration and AI orchestration.',
  slug: 'department-claws',
});

export default function BlogPost() {
  return <PostClient />;
}
