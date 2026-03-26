'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd from './JsonLd';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://clawmore.ai',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `https://clawmore.ai${item.href}`,
      })),
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link
          href="/"
          className="hover:text-cyber-blue transition-colors flex items-center gap-1"
        >
          <Home className="w-3 h-3" />
          <span>HOME</span>
        </Link>

        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 opacity-20" />
            <Link
              href={item.href}
              className={`hover:text-cyber-blue transition-colors ${
                index === items.length - 1 ? 'text-cyber-purple font-black' : ''
              }`}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </>
  );
}
