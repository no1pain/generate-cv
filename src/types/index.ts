export type TemplateType = "modern" | "classic" | "creative";

export interface ResumeFormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  targetPosition: string;
  additionalInfo: string;
}

export interface GeneratedResume {
  text: string;
  id?: string;
}
