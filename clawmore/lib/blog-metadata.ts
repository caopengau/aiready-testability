import { Metadata } from 'next';

interface BlogMetaInput {
  title: string;
  description: string;
  slug: string;
  image?: string;
}

export function generateBlogMetadata({
  title,
  description,
  slug,
  image = `/blog-assets/${slug}.png`,
}: BlogMetaInput): Metadata {
  const url = `https://clawmore.ai/blog/${slug}`;

  return {
    title: `${title} | ClawMore Blog`,
    description,
    openGraph: {
      title: `${title} | ClawMore`,
      description,
      url,
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ClawMore`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}
