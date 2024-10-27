import { Candidate, Vacancy, AIAnalysis, Interview } from '../types/recruitment';
import { analyzeInterviewResponse } from './aiChat';

interface RankingCriteria {
  skillsMatch: number;
  experienceWeight: number;
  interviewScore: number;
  cultureFit: number;
}

interface CandidateScore {
  candidateId: string;
  totalScore: number;
  breakdown: {
    skills: number;
    experience: number;
    interview: number;
    culture: number;
  };
  strengths: string[];
  weaknesses: string[];
}

export async function rankCandidates(
  candidates: Candidate[],
  vacancy: Vacancy,
  criteria: RankingCriteria = {
    skillsMatch: 0.3,
    experienceWeight: 0.2,
    interviewScore: 0.3,
    cultureFit: 0.2,
  }
): Promise<CandidateScore[]> {
  const rankedCandidates: CandidateScore[] = [];

  for (const candidate of candidates) {
    if (!candidate.aiNotes) continue;

    const analysis: AIAnalysis = JSON.parse(candidate.aiNotes);
    const interviewScore = candidate.aiScore || 0;

    const skillsScore = calculateSkillsMatch(analysis.skillsMatch, vacancy.requirements);
    const experienceScore = calculateExperienceScore(candidate.experience, vacancy);
    const cultureScore = analysis.cultureFit;

    const totalScore =
      skillsScore * criteria.skillsMatch +
      experienceScore * criteria.experienceWeight +
      interviewScore * criteria.interviewScore +
      cultureScore * criteria.cultureFit;

    rankedCandidates.push({
      candidateId: candidate.id,
      totalScore,
      breakdown: {
        skills: skillsScore,
        experience: experienceScore,
        interview: interviewScore,
        culture: cultureScore,
      },
      strengths: analysis.recommendations,
      weaknesses: analysis.redFlags || [],
    });
  }

  return rankedCandidates.sort((a, b) => b.totalScore - a.totalScore);
}

function calculateSkillsMatch(
  candidateSkills: { skill: string; score: number }[],
  requirements: string[]
): number {
  let totalScore = 0;
  let matchedSkills = 0;

  for (const requirement of requirements) {
    const matchingSkill = candidateSkills.find(
      (skill) => skill.skill.toLowerCase().includes(requirement.toLowerCase())
    );
    if (matchingSkill) {
      totalScore += matchingSkill.score;
      matchedSkills++;
    }
  }

  return matchedSkills > 0 ? totalScore / matchedSkills : 0;
}

function calculateExperienceScore(experience: number, vacancy: Vacancy): number {
  // Extract years from vacancy requirements or use default range
  const requiredYears = extractExperienceYears(vacancy.requirements) || { min: 2, max: 8 };
  
  if (experience < requiredYears.min) {
    return Math.max(0, experience / requiredYears.min * 0.7);
  } else if (experience <= requiredYears.max) {
    return 1;
  } else {
    return Math.max(0.8, 1 - (experience - requiredYears.max) / 10);
  }
}

function extractExperienceYears(requirements: string[]): { min: number; max: number } | null {
  for (const req of requirements) {
    const match = req.match(/(\d+)(?:-(\d+))?\s*(?:\+)?\s*years?/i);
    if (match) {
      const min = parseInt(match[1]);
      const max = match[2] ? parseInt(match[2]) : min + 6;
      return { min, max };
    }
  }
  return null;
}