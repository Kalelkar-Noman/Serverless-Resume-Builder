'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cx } from 'lib/cx';

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    ['/resume-builder', 'Builder'],
    ['/resume-parser', 'Parser'],
    ['/contact', 'Contact'],
    ['/terms', 'Terms'],
    ['/contributors', 'Contributors'],
  ];

  return (
    <header
      aria-label="Site Header"
      className={cx(
        'flex flex-col items-center border-b-2 border-gray-100 bg-white px-3 lg:px-12',
        isHomePage && 'bg-dot',
        isMobileMenuOpen ? 'h-auto py-2' : 'h-[var(--top-nav-bar-height)]'
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold tracking-tight text-primary">Free Resume</span>
          <span className="text-xl font-medium tracking-tight text-gray-900"> Builder</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Site Nav Bar"
          className="hidden items-center gap-2 text-sm font-medium lg:flex"
        >
          {navLinks.map(([href, text]) => (
            <Link
              key={text}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 lg:px-4"
              href={href}
            >
              {text}
            </Link>
          ))}
          <a
            className="flex items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:opacity-80"
            href="https://github.com/Kalelkar-Noman/Serverless-Resume-Builder"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Star us on GitHub
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="p-2 text-gray-500 hover:text-primary focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className="flex w-full flex-col items-center gap-2 pb-2 pt-4 text-sm font-medium lg:hidden">
          {navLinks.map(([href, text]) => (
            <Link
              key={text}
              className="w-full rounded-md px-4 py-2 text-center text-gray-500 hover:bg-gray-100 hover:text-primary"
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {text}
            </Link>
          ))}
          <a
            className="mt-2 flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-white hover:opacity-80"
            href="https://github.com/Kalelkar-Noman/Serverless-Resume-Builder"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Star us on GitHub
          </a>
        </nav>
      )}
    </header>
  );
};
