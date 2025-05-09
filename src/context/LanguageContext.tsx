"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface Translations {
  // Home page
  appTitle: string;
  appSubtitle: string;
  startButton: string;

  // Form labels
  personalInfoTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;

  educationTitle: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  addButton: string;
  removeButton: string;

  experienceTitle: string;
  company: string;
  position: string;
  jobDescription: string;

  skillsTitle: string;
  skillsPlaceholder: string;

  languagesTitle: string;
  languageName: string;
  proficiency: string;

  targetPositionTitle: string;
  desiredPosition: string;
  additionalInfo: string;

  templateTitle: string;
  modernTemplate: string;
  classicTemplate: string;
  creativeTemplate: string;

  generateButton: string;
  generatingButton: string;

  // Preview
  previewPlaceholder: string;
  generatingMessage: string;
  copyButton: string;
  copiedMessage: string;
  downloadButton: string;

  // Footer
  footerRights: string;
  supportProject: string;

  // Premium
  premiumMessage: string;
}

const translations: Translations = {
  appTitle: "AI Resume Generator",
  appSubtitle: "Create a professional resume in minutes",
  startButton: "Get Started",

  personalInfoTitle: "Personal Information",
  fullName: "Full Name",
  email: "Email",
  phone: "Phone",
  location: "Location",
  linkedin: "LinkedIn",
  github: "GitHub",

  educationTitle: "Education",
  institution: "Institution",
  degree: "Degree",
  startDate: "Start Date",
  endDate: "End Date",
  description: "Description",
  addButton: "Add",
  removeButton: "Remove",

  experienceTitle: "Work Experience",
  company: "Company",
  position: "Position",
  jobDescription: "Job Description",

  skillsTitle: "Skills",
  skillsPlaceholder: "List of skills (comma separated)",

  languagesTitle: "Languages",
  languageName: "Language",
  proficiency: "Proficiency",

  targetPositionTitle: "Target Position",
  desiredPosition: "Desired Position",
  additionalInfo: "Additional Information",

  templateTitle: "Template",
  modernTemplate: "Modern",
  classicTemplate: "Classic",
  creativeTemplate: "Creative",

  generateButton: "Generate Resume",
  generatingButton: "Generating...",

  previewPlaceholder: "Your generated resume will appear here",
  generatingMessage: "Generating your resume...",
  copyButton: "Copy",
  copiedMessage: "Copied!",
  downloadButton: "Download PDF",

  footerRights: "© 2024 AI Resume Generator. All rights reserved.",
  supportProject: "Support the project",

  premiumMessage: "This feature will be available in the premium version!",
};

interface LanguageContextType {
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = {
    t: translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
