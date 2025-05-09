import { NextResponse } from "next/server";
import { generateResume } from "@/shared/openai";
import { ResumeFormData } from "@/types";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ResumeFormData;

    if (!data.personalInfo.fullName || !data.targetPosition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resumeText = await generateResume(data);

    return NextResponse.json({ text: resumeText }, { status: 200 });
  } catch (error) {
    console.error("Error in resume generation:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
