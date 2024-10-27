import { AIAnalysis } from '../types/recruitment';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function parseResume(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file content');
        }

        let text = '';
        if (typeof event.target.result === 'string') {
          text = event.target.result;
        } else {
          const buffer = event.target.result as ArrayBuffer;
          const decoder = new TextDecoder('utf-8');
          text = decoder.decode(buffer);
        }
        
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

export async function analyzeResumeFile(file: File): Promise<AIAnalysis> {
  try {
    const resumeText = await parseResume(file);
    if (!resumeText) {
      throw new Error('No content found in resume file');
    }
    return await analyzeResume(resumeText);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

async function analyzeResume(resumeText: string): Promise<AIAnalysis> {
  try {
    const prompt = `
      Analyze this resume and provide a structured assessment with the following information:

      Resume Text:
      ${resumeText}

      Please provide a detailed analysis in the following format:
      1. Overall Score (0-100)
      2. Skills Assessment (list each skill with proficiency level)
      3. Experience Relevance (0-100)
      4. Key Strengths (bullet points)
      5. Areas for Improvement (bullet points)

      Ensure the response is detailed and actionable.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const analysis = response.choices[0].message.content;
    if (!analysis) {
      throw new Error('No analysis received from OpenAI');
    }

    return parseAnalysisResponse(analysis);
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to analyze resume content');
  }
}

function parseAnalysisResponse(analysisText: string): AIAnalysis {
  try {
    const analysis: AIAnalysis = {
      score: 0,
      skillsMatch: [],
      experienceRelevance: 0,
      cultureFit: 75, // Default value
      recommendations: [],
      redFlags: []
    };

    const sections = analysisText.split('\n\n');
    
    for (const section of sections) {
      if (section.toLowerCase().includes('score')) {
        const scoreMatch = section.match(/\d+/);
        if (scoreMatch) {
          analysis.score = parseInt(scoreMatch[0]);
        }
      }

      if (section.toLowerCase().includes('skills assessment')) {
        const skillLines = section.split('\n').slice(1);
        skillLines.forEach(line => {
          const skill = line.replace(/^[-•]/, '').trim();
          if (skill) {
            analysis.skillsMatch.push({
              skill,
              score: 85, // Default score
              notes: ''
            });
          }
        });
      }

      if (section.toLowerCase().includes('experience relevance')) {
        const relevanceMatch = section.match(/\d+/);
        if (relevanceMatch) {
          analysis.experienceRelevance = parseInt(relevanceMatch[0]);
        }
      }

      if (section.toLowerCase().includes('key strengths')) {
        const strengthLines = section.split('\n').slice(1);
        strengthLines.forEach(line => {
          const strength = line.replace(/^[-•]/, '').trim();
          if (strength) {
            analysis.recommendations.push(strength);
          }
        });
      }

      if (section.toLowerCase().includes('areas for improvement')) {
        const improvementLines = section.split('\n').slice(1);
        improvementLines.forEach(line => {
          const improvement = line.replace(/^[-•]/, '').trim();
          if (improvement) {
            analysis.redFlags.push(improvement);
          }
        });
      }
    }

    return analysis;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to parse analysis response');
  }
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  skills: string[];
}

export async function extractResumeData(file: File): Promise<ResumeData> {
  try {
    const resumeText = await parseResume(file);
    const analysis = await analyzeResume(resumeText);
    
    const extractedData: ResumeData = {
      name: '',
      email: '',
      phone: '',
      location: '',
      experience: 0,
      skills: analysis.skillsMatch.map(skill => skill.skill)
    };

    // Extract email
    const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      extractedData.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = resumeText.match(/\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/);
    if (phoneMatch) {
      extractedData.phone = phoneMatch[0];
    }

    // Extract experience (look for years of experience mentions)
    const experienceMatch = resumeText.toLowerCase().match(/(\d+)\+?\s*years?\s*(of)?\s*experience/);
    if (experienceMatch) {
      extractedData.experience = parseInt(experienceMatch[1]);
    }

    // Extract location (simple city/state pattern)
    const locationMatch = resumeText.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/);
    if (locationMatch) {
      extractedData.location = locationMatch[0];
    }

    return extractedData;
  } catch (error) {
    console.error('Resume analysis failed:', error);
    throw new Error('Failed to extract resume data');
  }
}