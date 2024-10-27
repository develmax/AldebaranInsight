import OpenAI from 'openai';
import { Candidate, Vacancy } from '../types/recruitment';

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

export async function startAIChat(
  candidate: Candidate,
  vacancy: Vacancy,
  message: string
) {
  try {
    validateApiKey();

    const systemPrompt = `
      You are an AI interviewer conducting a technical interview for the ${vacancy.title} position.
      The candidate's profile:
      - Name: ${candidate.name}
      - Experience: ${candidate.experience} years
      - Skills: ${candidate.skills.join(', ')}

      Job Requirements:
      ${vacancy.requirements.join('\n')}

      Your task is to:
      1. Assess the candidate's technical skills
      2. Evaluate their experience
      3. Determine culture fit
      4. Ask relevant follow-up questions
      5. Provide constructive feedback

      Keep responses professional and concise.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenAI Chat Error:', error);
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    throw error;
  }
}

export async function analyzeInterviewResponse(
  candidate: Candidate,
  vacancy: Vacancy,
  conversation: { role: string; content: string }[]
) {
  try {
    validateApiKey();

    const analysisPrompt = `
      Analyze this interview conversation for the ${vacancy.title} position.
      Provide a structured assessment of:
      1. Technical competency (0-100)
      2. Communication skills (0-100)
      3. Problem-solving ability (0-100)
      4. Cultural fit (0-100)
      5. Key strengths
      6. Areas for improvement
      7. Recommendation (proceed/review/reject)

      Conversation:
      ${conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: analysisPrompt }],
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