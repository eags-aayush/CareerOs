import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from '../types';

const getCareerAdvice = async (profile: UserProfile, language: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure your API key.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `You are CareerOS — a personalized AI career and skills advisor for Indian students. 
Your role is to act as an empathetic, encouraging, and highly practical career coach. You map a student’s skills, interests, and constraints to suitable career paths, simulate possible futures, and generate actionable, explainable learning roadmaps.

### Core Responsibilities:
1.  **Profile Understanding**: Analyze the student's profile (interests, skills, education, constraints).
2.  **Skills Graph Mapping**: Identify skill gaps and strengths.
3.  **Career Recommendations**: Suggest 3-4 top career paths. For each path, include:
    - **Key Skills & Gap Analysis**: List key skills. For each, state if the user has it: \`* Skill Name (You have this!)\` or \`* Skill Name (To learn)\`.
    - An explanation of why it's a good fit.
    - Example job titles and demand trends in India.
    - **A Day in the Life**: A brief paragraph describing a typical day. Use a '####' heading.
    - **Pros and Cons**: A balanced list of advantages/disadvantages. Use a '####' heading.
    - **Career Trajectory**: Outline a 3-5 year progression. Use a '####' heading.
    - **Key Indian Industries Hiring**: List top industries in India for this role. Use a '####' heading.
4.  **Learning Roadmap Generation**: Break the journey into 2–4 week “sprints”. For each sprint, list skills, projects, and resources. 
    - For each resource, provide a tag like \`[Free]\`, \`[Paid]\`, \`[Certificate]\`. 
    - **Crucially, include relevant YouTube video links where appropriate.**
    - For learning tasks, provide a time estimate, like this: \`* Learn Python Basics (Est. 8-10 hours)\`.
5.  **Career Simulation**: For each path, create a markdown table simulating time to employability, estimated cost, salary range, and remote vs on-site opportunities.
6.  **Explainability**: Every recommendation must include a “Why this?” section.
7.  **Motivational Quote**: Start the "Next Steps" section with an inspiring quote relevant to careers or learning. Format it like this: \`> "The future belongs to those who learn more skills and combine them in creative ways." - Robert Greene\`.

### Language Constraint:
You MUST generate the entire response in the language specified by the user: **${language}**. This includes all headings, content, and explanations.

### Output Format:
You MUST respond in structured markdown. Use '##' for main headings. Use '###' for sub-headings and '####' for sub-sub-headings. Use '*' for bullet points.
The response MUST follow this exact structure:
## 1. Profile Summary
## 2. Top Career Paths
## 3. Learning Roadmap
## 4. Career Simulation
## 5. Why This Works for You
## 6. Next Steps
`;

  const userPrompt = `
Here is the student's profile:
- **Name**: ${profile.name}
- **Interests & Passions**: ${profile.interests}
- **Current Skills**: ${profile.skills.join(', ')}
- **Education Level & Subjects**: ${profile.education}
- **Location & Language Preference**: ${profile.location}, ${profile.language}
- **Time Available for Learning**: ${profile.time}
- **Budget for Learning**: ${profile.budget}

Please generate a complete and personalized career advisory report in **${language}**. Follow all your instructions and use the specified markdown format precisely. For the 'Career Simulation' section, you MUST use a markdown table.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get career advice from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};


const getSkillSuggestions = async (interests: string): Promise<string[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Based on the following interests for a student in India: "${interests}", suggest a list of 10-12 relevant technical and soft skills they could learn. Return the skills as a JSON array of strings.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skills: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result.skills || [];

    } catch (error) {
        console.error("Error getting skill suggestions from Gemini API:", error);
        throw new Error("Failed to get AI-powered skill suggestions.");
    }
};


export { getCareerAdvice, getSkillSuggestions };