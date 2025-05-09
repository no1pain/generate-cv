import OpenAI from "openai";
import { ResumeFormData } from "@/types";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY environment variable is not set");
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

/**
 * Generate a resume using OpenAI API
 */
export async function generateResume(data: ResumeFormData): Promise<string> {
  try {
    // Check if we have an API key
    if (!apiKey) {
      // Fall back to the internal API if no OpenAI key is available
      return await fallbackToInternalAPI(data);
    }

    // Use the actual OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const {
      personalInfo,
      education,
      experience,
      skills,
      languages,
      targetPosition,
      additionalInfo,
    } = data;

    // Create a structured prompt for better results
    const prompt = `
Create a professional resume for ${
      personalInfo.fullName
    } who is applying for a position as ${targetPosition}.

Personal Information:
- Name: ${personalInfo.fullName}
- Email: ${personalInfo.email || "Not provided"}
- Phone: ${personalInfo.phone || "Not provided"}
- Location: ${personalInfo.location || "Not provided"}
- LinkedIn: ${personalInfo.linkedin || "Not provided"}
- GitHub: ${personalInfo.github || "Not provided"}

Education:
${education
  .map(
    (edu) =>
      `- ${edu.degree} at ${edu.institution}, ${edu.startDate} - ${
        edu.endDate
      }${edu.description ? "\n  " + edu.description : ""}`
  )
  .join("\n")}

Work Experience:
${experience
  .map(
    (exp) =>
      `- ${exp.position} at ${exp.company}, ${exp.startDate} - ${exp.endDate}\n  ${exp.description}`
  )
  .join("\n\n")}

Skills:
${skills.join(", ")}

Languages:
${languages.map((lang) => `${lang.language} (${lang.proficiency})`).join(", ")}

Additional Information:
${additionalInfo || "Not provided"}

Format the resume in a clean, professional style suitable for ATS systems. Use bullet points for experience descriptions and highlight key achievements.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer specialized in creating effective, ATS-friendly resumes. Create content that is concise, impactful, and tailored to the target position.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating resume with OpenAI:", error);
    // Fall back to the internal API if there's an error with OpenAI
    return await fallbackToInternalAPI(data);
  }
}

/**
 * Fallback function to use the internal API when OpenAI is not available
 */
async function fallbackToInternalAPI(data: ResumeFormData): Promise<string> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/generate-resume`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate resume");
  }

  const result = await response.json();
  return result.text;
}
