import Link from 'next/link';
import { FlexboxSpacer } from 'components/FlexboxSpacer';
import { AutoTypingResume } from 'home/AutoTypingResume';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-transparent lg:flex lg:h-[825px] lg:justify-center">
      {/* Decorative background blur */}
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl" />
      <div className="absolute bottom-[20%] right-[-5%] h-72 w-72 rounded-full bg-primary opacity-20 blur-3xl" />

      <FlexboxSpacer maxWidth={75} minWidth={0} className="z-10 hidden lg:block" />
      <div className="z-10 mx-auto max-w-xl pt-12 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <h1 className="text-theme-text-main animate-fade-in pb-2 text-5xl font-extrabold tracking-tight lg:text-6xl">
          Create a{' '}
          <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
            professional
          </span>
          <br />
          resume easily
        </h1>
        <p className="text-theme-text-muted animate-slide-up mt-4 text-lg lg:mt-6 lg:text-xl">
          With this free, open-source, and highly powerful serverless resume builder
        </p>
        <div className="animate-slide-up mt-8 lg:mt-12" style={{ animationDelay: '0.1s' }}>
          <Link
            href="/resume-import"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-primary-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Resume{' '}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
          <p className="text-theme-text-muted mt-3 text-sm font-medium lg:ml-6 lg:mt-4">
            No sign up required. 100% free.
          </p>
        </div>
        <p
          className="text-theme-text-muted animate-fade-in mt-8 text-sm lg:mt-36"
          style={{ animationDelay: '0.3s' }}
        >
          Already have a resume? Test its ATS readability with our{' '}
          <Link
            href="/resume-parser"
            className="font-semibold text-primary underline-offset-2 transition-colors hover:text-primary-600 hover:underline"
          >
            resume parser
          </Link>
        </p>
      </div>
      <FlexboxSpacer maxWidth={100} minWidth={50} className="z-10 hidden lg:block" />
      <div className="animate-float z-10 mt-10 flex justify-center lg:mt-16 lg:block lg:grow">
        <AutoTypingResume />
      </div>
    </section>
  );
};
