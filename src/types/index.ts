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

export interface SubscriptionDetails {
  id: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
  status: string;
  plan_type: string;
  plan_period: string;
  current_period_start: string | null;
  current_period_end: string | null;
  gumroad_subscription_id: string | null;
  cancel_at_period_end: boolean;
}

export type SubscriptionStatus = "active" | "canceled" | "ended" | "failed";
export type SubscriptionPlanPeriod = "monthly" | "yearly";
export type SubscriptionPlanType = "premium" | "basic";

export interface EducationItem {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}
