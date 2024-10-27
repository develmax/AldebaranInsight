import OpenAI from 'openai';
import { AIAnalysis, Candidate, Vacancy } from '../types/recruitment';

function validateApiKey() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey || !apiKey.startsWith('sk-')) {
    throw new Error('Invalid or missing OpenAI API key. Please check your environment configuration.');
  }
  return apiKey;
}

const openai = new OpenAI({
  apiKey: validateApiKey(),
  dangerouslyAllowBrowser: true
});

export async function analyzeResume(resumeText: string, vacancy?: Vacancy): Promise<AIAnalysis> {
  try {
    validateApiKey();

    const prompt = `
      Analyze this candidate's resume and extract the following information in a structured format:
      
      Resume:
      ${resumeText}
      
      Please provide the analysis in the following JSON format:
      {
        "personalInfo": {
          "name": "extracted full name",
          "email": "extracted email",
          "phone": "extracted phone",
          "location": "extracted location"
        },
        "professionalInfo": {
          "yearsOfExperience": number,
          "skills": ["skill1", "skill2", ...],
          "currentRole": "current job title",
          "education": "highest education level"
        },
        "analysis": {
          "overallScore": number (0-100),
          "skillsMatch": [
            { "skill": "skill name", "score": number, "notes": "evaluation notes" }
          ],
          "experienceRelevance": number (0-100),
          "cultureFit": number (0-100),
          "recommendations": ["recommendation1", "recommendation2", ...],
          "redFlags": ["concern1", "concern2", ...]
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      score: parsedResponse.analysis.overallScore || 0,
      skillsMatch: parsedResponse.analysis.skillsMatch || [],
      experienceRelevance: parsedResponse.analysis.experienceRelevance || 0,
      cultureFit: parsedResponse.analysis.cultureFit || 0,
      recommendations: parsedResponse.analysis.recommendations || [],
      redFlags: parsedResponse.analysis.redFlags || [],
      extractedInfo: {
        personal: parsedResponse.personalInfo || {},
        professional: parsedResponse.professionalInfo || {}
      }
    };
  } catch (error: any) {
    console.error('OpenAI Analysis Error:', error);
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    throw error;
  }
}

export async function analyzeSocialProfiles(linkedinData: string, githubData: string) {
  try {
    validateApiKey();

    const prompt = `
      Analyze these social profiles for professional assessment:
      
      LinkedIn:
      ${linkedinData}
      
      GitHub:
      ${githubData}
      
      Provide insights on:
      1. Professional experience
      2. Technical skills
      3. Activity level
      4. Collaboration style
      5. Notable achievements
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenAI Analysis Error:', error);
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    throw error;
  }
}