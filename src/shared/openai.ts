import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY environment variable is not set");
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

export async function generateResume(data: any) {
  try {
    const prompt = `
    Generate a professional resume in Ukrainian for the position of ${
      data.targetPosition
    } based on the following information:
    
    Name: ${data.personalInfo.fullName}
    Email: ${data.personalInfo.email}
    ${data.personalInfo.phone ? `Phone: ${data.personalInfo.phone}` : ""}
    ${
      data.personalInfo.location
        ? `Location: ${data.personalInfo.location}`
        : ""
    }
    
    Education:
    ${data.education
      .map(
        (edu: any) =>
          `- ${edu.institution}, ${edu.degree}, ${edu.startDate} - ${
            edu.endDate
          }
       ${edu.description ? edu.description : ""}`
      )
      .join("\n")}
    
    Experience:
    ${data.experience
      .map(
        (exp: any) =>
          `- ${exp.company}, ${exp.position}, ${exp.startDate} - ${exp.endDate}
       ${exp.description}`
      )
      .join("\n")}
    
    Skills: ${data.skills.join(", ")}
    
    ${
      data.languages
        ? `Languages: ${data.languages
            .map((lang: any) => `${lang.language} (${lang.proficiency})`)
            .join(", ")}`
        : ""
    }
    
    ${
      data.additionalInfo
        ? `Additional Information: ${data.additionalInfo}`
        : ""
    }
    
    Please create a professional and well-structured resume. Format the text with clear sections for education, experience, skills, etc.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer who creates excellent resumes.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
}
