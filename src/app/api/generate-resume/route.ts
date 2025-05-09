import { NextResponse } from "next/server";
import { ResumeFormData } from "@/types";
import { generateResume } from "@/shared/openai";

async function generateResumeWithAI(data: ResumeFormData): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const {
    personalInfo,
    education,
    experience,
    skills,
    languages,
    targetPosition,
    additionalInfo,
  } = data;

  const skillsString = skills.join(", ");

  const languagesString = languages
    .map((l) => `${l.language} (${l.proficiency})`)
    .join(", ");

  return `${personalInfo.fullName.toUpperCase()}
${targetPosition}
${personalInfo.location}${
    personalInfo.phone ? ` | ${personalInfo.phone}` : ""
  }${personalInfo.email ? ` | ${personalInfo.email}` : ""}${
    personalInfo.linkedin ? ` | ${personalInfo.linkedin}` : ""
  }${personalInfo.github ? ` | ${personalInfo.github}` : ""}

SUMMARY
${
  additionalInfo ||
  `Experienced professional seeking a position as ${targetPosition}. Bringing a strong background in ${skillsString
    .split(", ")
    .slice(0, 3)
    .join(", ")}, and a passion for delivering high-quality results.`
}

EXPERIENCE
${experience
  .map(
    (exp) => `${exp.position}, ${exp.company}
${exp.startDate} - ${exp.endDate}
${exp.description
  .split("\n")
  .map((line) => `• ${line}`)
  .join("\n")}`
  )
  .join("\n\n")}

EDUCATION
${education
  .map(
    (edu) => `${edu.degree}
${edu.institution}, ${edu.startDate} - ${edu.endDate}
${edu.description ? edu.description : ""}`
  )
  .join("\n\n")}

SKILLS
${skillsString}

${
  languages.length > 0
    ? `LANGUAGES
${languagesString}`
    : ""
}`;
}

export async function POST(request: Request) {
  try {
    const data: ResumeFormData = await request.json();

    // Validate required fields
    if (!data.personalInfo?.fullName || !data.targetPosition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Try to use OpenAI integration first
      const resumeText = await generateResume(data);

      // Return the generated resume with OpenAI metadata
      return NextResponse.json(
        {
          text: resumeText,
          usingOpenAI: true,
          model: "GPT-4o",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(
        "Error with OpenAI integration, falling back to default:",
        error
      );

      // Fallback to the local implementation if OpenAI fails
      const resumeText = await generateResumeWithAI(data);
      return NextResponse.json(
        {
          text: resumeText,
          usingOpenAI: false,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
