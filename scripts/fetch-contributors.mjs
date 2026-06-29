import fs from 'fs';
import path from 'path';
import https from 'https';

const contributorsFile = path.join(process.cwd(), 'contributors.json');
const outputDir = path.join(process.cwd(), 'public', 'assets');
const outputFile = path.join(outputDir, 'contributors-data.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function fetchUser(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}`,
      headers: {
        'User-Agent': 'Node.js/Contributors-Fetcher',
      },
    };

    https
      .get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            console.warn(`Failed to fetch ${username}: ${res.statusCode} - ${data}`);
            resolve(null);
          }
        });
      })
      .on('error', (err) => reject(err));
  });
}

async function run() {
  console.log('Fetching contributors data...');
  if (!fs.existsSync(contributorsFile)) {
    console.warn('contributors.json not found, skipping fetch.');
    return;
  }

  const usernames = JSON.parse(fs.readFileSync(contributorsFile, 'utf8'));
  const results = [];

  for (const username of usernames) {
    console.log(`Fetching profile for ${username}...`);
    const profile = await fetchUser(username);
    if (profile) {
      results.push({
        login: profile.login,
        name: profile.name || profile.login,
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
      });
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`Wrote ${results.length} contributors to ${outputFile}`);
}

run().catch(console.error);
