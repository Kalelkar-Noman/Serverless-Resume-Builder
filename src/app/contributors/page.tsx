import { Heading, Paragraph } from 'components/documentation';
import Image from 'next/image';
import fs from 'fs/promises';
import path from 'path';

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
}

export default async function Contributors() {
  const filePath = path.join(process.cwd(), 'contributors.json');
  let usernames: string[] = [];
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    usernames = JSON.parse(fileData);
  } catch (e) {
    console.error('Failed to read contributors.json', e);
  }

  const contributors: GitHubProfile[] = [];

  for (const username of usernames) {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
      });
      if (res.ok) {
        const data = await res.json();
        contributors.push(data);
      }
    } catch (e) {
      console.error(`Failed to fetch profile for ${username}`);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Heading className="text-center text-primary">Contributors</Heading>
      <Paragraph className="text-center" smallMarginTop>
        Thank you to all the amazing people who have contributed to this project!
      </Paragraph>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {contributors.map((user) => (
          <a
            key={user.login}
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-theme-base bg-theme-card flex items-center gap-4 rounded-lg border p-6 shadow-sm transition-shadow hover:border-primary hover:shadow-md"
          >
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={64}
              height={64}
              className="border-theme-base h-16 w-16 rounded-full border"
              unoptimized={false}
            />
            <div>
              <h2 className="text-theme-text-main font-semibold">{user.name || user.login}</h2>
              <p className="text-theme-text-muted text-sm">@{user.login}</p>
            </div>
          </a>
        ))}
        {contributors.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No contributors found yet.</p>
        )}
      </div>
    </main>
  );
}
