import { Heading, Paragraph } from 'components/documentation';
import Link from 'next/link';

export default function Contact() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Heading className="text-center text-primary">Contact Us</Heading>
      <div className="border-theme-base bg-theme-card mt-8 rounded-lg border p-8 shadow-sm">
        <Paragraph>
          We'd love to hear from you! Whether you have a question, feature request, or just want to
          say hi, you can reach out to us via email or open an issue on our GitHub repository.
        </Paragraph>
        <div className="mt-6">
          <h2 className="text-theme-text-main text-xl font-semibold">Email</h2>
          <Paragraph smallMarginTop>
            You can reach us at{' '}
            <Link href="mailto:kalelkarnoman014@gmail.com" className="text-primary hover:underline">
              kalelkarnoman014@gmail.com
            </Link>
          </Paragraph>
        </div>
        <div className="mt-6">
          <h2 className="text-theme-text-main text-xl font-semibold">GitHub</h2>
          <Paragraph smallMarginTop>
            For bug reports and feature requests, please open an issue on our{' '}
            <Link
              href="https://github.com/Kalelkar-Noman/Serverless-Resume-Builder/issues"
              target="_blank"
              className="text-primary hover:underline"
            >
              GitHub Repository
            </Link>
            .
          </Paragraph>
        </div>
      </div>
    </main>
  );
}
