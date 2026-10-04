import "server-only";
import { profile } from "./content";

export type GitHubStats = {
  publicRepos: number;
  followers: number;
  ownRepos: number;
  stars: number;
  languages: { name: string; share: number }[];
  lastPush: { repo: string; url: string; label: string } | null;
};

type Repo = {
  name: string;
  html_url: string;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
};

type User = { public_repos: number; followers: number };

const API = "https://api.github.com";

async function get<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Server-only token (optional). Never exposed to the client bundle.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`${API}${path}`, {
    headers,
    next: { revalidate: 60 * 60 * 6 },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Public profile data for the Open Source section. Returns `null` on any
 * failure so the page never depends on GitHub's API being reachable.
 */
export async function getGitHubStats(): Promise<GitHubStats | null> {
  try {
    const [user, repos] = await Promise.all([
      get<User>(`/users/${profile.githubHandle}`),
      get<Repo[]>(`/users/${profile.githubHandle}/repos?per_page=100&sort=pushed`),
    ]);
    const own = repos.filter((r) => !r.fork && r.name !== profile.githubHandle);

    const counts = new Map<string, number>();
    own.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1));
    const withLang = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
    const languages = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, n]) => ({ name, share: n / withLang }));

    const latest = [...own].sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))[0];

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      ownRepos: own.length,
      stars: own.reduce((a, r) => a + r.stargazers_count, 0),
      languages,
      lastPush: latest
        ? {
            repo: latest.name,
            url: latest.html_url,
            label: new Date(latest.pushed_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "Asia/Kolkata",
            }),
          }
        : null,
    };
  } catch {
    return null;
  }
}
