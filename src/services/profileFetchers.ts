import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export async function fetchGitHubProfile(githubUrl: string) {
  try {
    // Extract username from GitHub URL
    const username = githubUrl.split('/').pop();
    if (!username) throw new Error('Invalid GitHub URL');

    // Fetch user data
    const { data: user } = await octokit.users.getByUsername({ username });

    // Fetch user's repositories
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 10,
    });

    // Fetch user's contributions
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });

    // Structure the data for analysis
    return JSON.stringify({
      profile: {
        name: user.name,
        bio: user.bio,
        company: user.company,
        location: user.location,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        createdAt: user.created_at,
      },
      repositories: repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
      })),
      activity: events.map(event => ({
        type: event.type,
        repo: event.repo.name,
        createdAt: event.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw error;
  }
}

export async function fetchLinkedInProfile(linkedinUrl: string) {
  // Note: LinkedIn's API requires OAuth and is restricted.
  // For a production app, you would need to:
  // 1. Implement OAuth flow
  // 2. Use LinkedIn's API with proper authentication
  // 3. Handle rate limiting and data access permissions
  
  // For now, we'll return a placeholder message
  return `LinkedIn profile URL: ${linkedinUrl}\nNote: Full LinkedIn profile analysis requires OAuth implementation.`;
}