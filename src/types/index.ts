export type ResumeFormData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  languages?: Array<{
    language: string;
    proficiency: "Basic" | "Intermediate" | "Advanced" | "Fluent" | "Native";
  }>;
  targetPosition: string;
  additionalInfo?: string;
};

export type TemplateType = "modern" | "classic" | "creative";

export type GeneratedResume = {
  text: string;
  html?: string;
  pdfUrl?: string;
};
