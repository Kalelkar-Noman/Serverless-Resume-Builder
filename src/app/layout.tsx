import 'globals.css';
import { TopNavBar } from 'components/TopNavBar';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Free Resume Builder - Create ATS-Friendly Resume Online | Kalelkar Noman',
  description:
    'Create a professional ATS-friendly resume online for free. Build, customize, and download PDF resumes directly in your browser with no signup required. Privacy-first resume builder by Kalelkar Noman.',
  authors: [{ name: 'Kalelkar Noman' }],
  robots: 'index, follow',
  metadataBase: new URL('https://resume-builder-noman-kalelkar.netlify.app/'),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: 'Free Resume Builder - Create ATS-Friendly Resume Online',
    description:
      'Create a professional ATS-friendly resume online for free. Build, customize, and download PDF resumes directly in your browser with no signup required.',
    url: 'https://resume-builder-noman-kalelkar.netlify.app/',
    siteName: 'Resume Builder by Kalelkar Noman',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://resume-builder-noman-kalelkar.netlify.app/assets/img/kalelkar-noman-profile.webp',
        width: 1200,
        height: 630,
        alt: 'Free Resume Builder by Kalelkar Noman',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder - Create ATS-Friendly Resume Online',
    description:
      'Create a professional ATS-friendly resume online for free. Build, customize, and download PDF resumes directly in your browser with no signup required.',
    images: [
      'https://resume-builder-noman-kalelkar.netlify.app/assets/img/kalelkar-noman-profile.webp',
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Free Resume Builder',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://resume-builder-noman-kalelkar.netlify.app/',
  author: {
    '@type': 'Person',
    name: 'Kalelkar Noman',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Free ATS-friendly resume builder with PDF export. No signup required. Built by Kalelkar Noman.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <TopNavBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
