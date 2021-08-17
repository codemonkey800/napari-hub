import type { Octokit as OctokitInstance } from '@octokit/rest';

import { PluginRepoData } from '@/types';
/**
 * Regex used for capturing the repo name in a repo URL.
 * Inspiration: https://regexr.com/4uvj8
 */
const REPO_REGEX = /(?:git@|https:\/\/)(github).com[/:](.*)(?:.git)?/;

let octokit: OctokitInstance | undefined;

export async function fetchRepoData(
  url: string,
): Promise<PluginRepoData | undefined> {
  const match = REPO_REGEX.exec(url);
  let repoData: PluginRepoData | undefined;

  if (match) {
    const [, type, name] = match;
    const [owner, repo] = name.split('/');

    if (type === 'github') {
      // Initialize octokit once on server
      if (!octokit) {
        const { Octokit } = await import('@octokit/rest');
        const { createOAuthAppAuth } = await import('@octokit/auth-oauth-app');

        // Authenticate as oauth app
        octokit = new Octokit({
          authStrategy: createOAuthAppAuth,
          auth: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            clientType: 'oauth-app',
          },
        });
      }

      const { data, status } = await octokit.repos.get({
        owner,
        repo,
      });

      if (status === 200) {
        repoData = {
          forks: data.forks_count,
          issuesAndPRs: data.open_issues_count,
          stars: data.stargazers_count,
        };
      }
    } else if (type === 'gitlab') {
      // TODO Implement GitLab support
    }
  }

  return repoData;
}
