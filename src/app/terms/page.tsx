import { Heading, Paragraph } from 'components/documentation';

export default function Terms() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Heading className="text-center text-primary">Terms of Service & Privacy</Heading>
      <div className="border-theme-base bg-theme-card mt-8 rounded-lg border p-8 shadow-sm">
        <h2 className="text-theme-text-main text-xl font-semibold">Privacy Policy</h2>
        <Paragraph smallMarginTop>
          Serverless Resume Builder is designed with your privacy in mind. We do not store any of
          your resume data on our servers. All parsing, rendering, and processing happens locally in
          your browser. Your data never leaves your device.
        </Paragraph>
        <div className="mt-6">
          <h2 className="text-theme-text-main text-xl font-semibold">Terms of Service</h2>
          <Paragraph smallMarginTop>
            By using this application, you agree to our terms. This project is a fork and heavily
            inspired by the{' '}
            <a
              href="https://github.com/xitanggg/open-resume"
              target="_blank"
              className="text-primary hover:underline"
            >
              open-resume
            </a>{' '}
            project, licensed under the MIT License. It is provided "as is" without any warranty. We
            are not responsible for any direct or indirect damages or job application results
            resulting from the use of this software.
          </Paragraph>
        </div>
      </div>
    </main>
  );
}
