import { Candidate, Vacancy } from '../types/recruitment';
import { analyzeSocialProfiles } from './openai';
import { fetchGitHubProfile, fetchLinkedInProfile } from './profileFetchers';

export async function analyzeCandidateProfiles(candidate: Candidate, vacancy: Vacancy) {
  try {
    let linkedinData = '';
    let githubData = '';

    if (candidate.linkedinUrl) {
      linkedinData = await fetchLinkedInProfile(candidate.linkedinUrl);
    }

    if (candidate.githubUrl) {
      githubData = await fetchGitHubProfile(candidate.githubUrl);
    }

    if (!linkedinData && !githubData) {
      throw new Error('No social profiles available for analysis');
    }

    const analysis = await analyzeSocialProfiles(linkedinData, githubData);
    return analysis;
  } catch (error) {
    console.error('Error analyzing social profiles:', error);
    throw error;
  }
}