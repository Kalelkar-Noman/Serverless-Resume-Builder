import { parseResumeFromPdf } from './src/app/lib/parse-resume-from-pdf/index.js';

async function test() {
  try {
    const resume = await parseResumeFromPdf('dummy-path.pdf');
    console.log('Success:', resume);
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
