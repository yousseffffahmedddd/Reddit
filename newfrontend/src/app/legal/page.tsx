'use client';

import Link from 'next/link';
import { FileText, Shield, Scale } from 'lucide-react';

export default function LegalPage() {
  const policies = [
    {
      title: 'User Agreement',
      description: 'Terms and conditions for using our platform, including your rights and responsibilities.',
      href: '/legal/user-agreement',
      icon: Scale,
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, protect, and share your personal information.',
      href: '/legal/privacy-policy',
      icon: Shield,
    },
    {
      title: 'Content Policy',
      description: 'Guidelines for acceptable content and behavior on our platform.',
      href: '/legal/content-policy',
      icon: FileText,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Legal & Policies</h1>
      <p className="text-muted-foreground mb-8">
        Review our policies to understand how [PROJECT_NAME] works and your rights as a user.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {policies.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <policy.icon className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-lg font-semibold group-hover:text-primary">
              {policy.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {policy.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-lg font-semibold mb-2">Questions?</h2>
        <p className="text-muted-foreground mb-4">
          If you have any questions about our policies, please don't hesitate to reach out.
        </p>
        <p className="text-sm">
          <strong>Email:</strong>{' '}
          <a href="mailto:[CONTACT_EMAIL]" className="text-primary hover:underline">
            [CONTACT_EMAIL]
          </a>
        </p>
      </div>
    </div>
  );
}
