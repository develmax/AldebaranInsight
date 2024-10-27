import { Candidate, Vacancy } from '../types/recruitment';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function searchCandidates(
  vacancy: Vacancy,
  searchCriteria: {
    skills?: string[];
    experience?: number;
    location?: string;
    type?: string;
  }
) {
  const prompt = `
    Search for candidates matching this job vacancy:

    Position: ${vacancy.title}
    Department: ${vacancy.department}
    Requirements:
    ${vacancy.requirements.join('\n')}

    Search Criteria:
    ${searchCriteria.skills ? `Skills: ${searchCriteria.skills.join(', ')}` : ''}
    ${searchCriteria.experience ? `Experience: ${searchCriteria.experience}+ years` : ''}
    ${searchCriteria.location ? `Location: ${searchCriteria.location}` : ''}
    ${searchCriteria.type ? `Employment Type: ${searchCriteria.type}` : ''}

    Provide search recommendations and keywords for finding ideal candidates.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export async function matchCandidateToVacancy(
  candidate: Candidate,
  vacancy: Vacancy
) {
  const prompt = `
    Analyze this candidate's fit for the position:

    Position: ${vacancy.title}
    Requirements:
    ${vacancy.requirements.join('\n')}

    Candidate:
    Name: ${candidate.name}
    Experience: ${candidate.experience} years
    Skills: ${candidate.skills.join(', ')}
    Location: ${candidate.location}

    Provide a detailed analysis of:
    1. Skills match (%)
    2. Experience relevance
    3. Location compatibility
    4. Overall fit score
    5. Recommendations
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export function filterCandidates(
  candidates: Candidate[],
  criteria: {
    skills?: string[];
    minExperience?: number;
    location?: string;
    status?: string[];
  }
): Candidate[] {
  return candidates.filter(candidate => {
    const matchesSkills = !criteria.skills?.length || 
      criteria.skills.every(skill => 
        candidate.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );

    const matchesExperience = !criteria.minExperience ||
      candidate.experience >= criteria.minExperience;

    const matchesLocation = !criteria.location ||
      candidate.location.toLowerCase().includes(criteria.location.toLowerCase());

    const matchesStatus = !criteria.status?.length ||
      criteria.status.includes(candidate.status);

    return matchesSkills && matchesExperience && matchesLocation && matchesStatus;
  });
}