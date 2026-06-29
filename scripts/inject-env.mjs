import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'src', 'index.html');
const envPath = path.join(rootDir, '.env');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const env = {};
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }

  return env;
}

const env = {
  ...process.env,
  ...parseEnvFile(envPath),
};

const verificationValue = env.GOOGLE_SITE_VERIFICATION || '';

if (!fs.existsSync(indexPath)) {
  throw new Error(`Index file not found at ${indexPath}`);
}

const original = fs.readFileSync(indexPath, 'utf8');
const updated = original.replace(
  /<meta\s+name="google-site-verification"\s+content="[^"]*"\s*\/?>/i,
  `<meta name="google-site-verification" content="${verificationValue}" />`,
);

if (updated !== original) {
  fs.writeFileSync(indexPath, updated);
}
