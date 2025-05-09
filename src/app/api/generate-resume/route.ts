import { NextResponse } from "next/server";
import { ResumeFormData } from "@/types";
import { generateResume } from "@/shared/openai";
import { createClient } from "@/lib/supabase/server";

// Local fallback implementation if OpenAI fails
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

  // Handle both string and array types for backward compatibility
  const skillsString = Array.isArray(skills) ? skills.join(", ") : skills;

  const languagesString = languages
    .map((l) => `${l.language} (${l.proficiency})`)
    .join(", ");

  return `${personalInfo.fullName?.toUpperCase() || ""}
${targetPosition}
${personalInfo.location || ""}${
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
    // Get current user from the request cookies
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const data: ResumeFormData = await request.json();

    // Validate required fields
    if (!data.personalInfo?.fullName || !data.targetPosition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let resumeText;
    let usedOpenAI = false;

    try {
      // Try to use OpenAI integration first
      resumeText = await generateResume(data);
      usedOpenAI = true;
    } catch (error) {
      console.error(
        "Error with OpenAI integration, falling back to default:",
        error
      );

      // Fallback to the local implementation if OpenAI fails
      resumeText = await generateResumeWithAI(data);
    }

    // Save the generated resume to the database
    const { data: savedResume, error: saveError } = await supabase
      .from("resumes")
      .insert({
        user_id: userId,
        title: `Resume for ${data.targetPosition}`,
        content: resumeText,
        target_position: data.targetPosition,
        template: data.template || "standard",
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving resume:", saveError);
      // Continue despite error - we'll return the text but warn that saving failed
    }

    // Return the generated resume with metadata
    return NextResponse.json(
      {
        text: resumeText,
        usingOpenAI: usedOpenAI,
        model: usedOpenAI ? "GPT-4o" : "local",
        saved: !saveError,
        resumeId: savedResume?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
