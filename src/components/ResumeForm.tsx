import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ResumeFormData, TemplateType } from "@/types";

type ResumeFormProps = {
  onSubmit: (data: ResumeFormData) => void;
  isLoading: boolean;
};

export default function ResumeForm({ onSubmit, isLoading }: ResumeFormProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("modern");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResumeFormData>({
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phoneNumber: "",
        location: "",
        linkedIn: "",
        portfolio: "",
      },
      education: [
        {
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      experience: [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      skills: [],
      languages: [{ language: "", proficiency: "Intermediate" }],
      targetPosition: "",
      additionalInfo: "",
      template: "modern",
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const handleTemplateChange = (template: TemplateType) => {
    setSelectedTemplate(template);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              {...register("personalInfo.fullName", {
                required: "Full name is required",
              })}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {/* @ts-expect-error - Property access in errors object */}
            {errors.personalInfo?.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {/* @ts-expect-error - Property access in errors object */}
                {errors.personalInfo.fullName.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              {...register("personalInfo.email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {/* @ts-expect-error - Property access in errors object */}
            {errors.personalInfo?.email && (
              <p className="mt-1 text-sm text-red-600">
                {/* @ts-expect-error - Property access in errors object */}
                {errors.personalInfo.email.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              {...register("personalInfo.phoneNumber")}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Location
            </label>
            <input
              {...register("personalInfo.location")}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              LinkedIn URL
            </label>
            <input
              {...register("personalInfo.linkedIn")}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Portfolio/Website
            </label>
            <input
              {...register("personalInfo.portfolio")}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Education</h2>
          <button
            type="button"
            onClick={() =>
              appendEducation({
                institution: "",
                degree: "",
                startDate: "",
                endDate: "",
                description: "",
              })
            }
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Education
          </button>
        </div>

        {educationFields.map((field, index) => (
          <div
            key={field.id?.toString()}
            className="border rounded-md p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Education #{index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Institution
                </label>
                <input
                  {...register(`education.${index}.institution` as const, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Degree
                </label>
                <input
                  {...register(`education.${index}.degree` as const, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Start Date
                </label>
                <input
                  {...register(`education.${index}.startDate` as const)}
                  placeholder="MM/YYYY"
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  End Date
                </label>
                <input
                  {...register(`education.${index}.endDate` as const)}
                  placeholder="MM/YYYY or Present"
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                {/* @ts-expect-error - Textarea incompatible with register return type */}
                <textarea
                  {...register(`education.${index}.description` as const)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Work Experience</h2>
          <button
            type="button"
            onClick={() =>
              appendExperience({
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
              })
            }
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Experience
          </button>
        </div>

        {experienceFields.map((field, index) => (
          <div
            key={field.id?.toString()}
            className="border rounded-md p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Experience #{index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Company
                </label>
                <input
                  {...register(`experience.${index}.company` as const, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Position
                </label>
                <input
                  {...register(`experience.${index}.position` as const, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Start Date
                </label>
                <input
                  {...register(`experience.${index}.startDate` as const)}
                  placeholder="MM/YYYY"
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  End Date
                </label>
                <input
                  {...register(`experience.${index}.endDate` as const)}
                  placeholder="MM/YYYY or Present"
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">
                  Job Description
                </label>
                {/* @ts-expect-error - Textarea incompatible with register return type */}
                <textarea
                  {...register(`experience.${index}.description` as const, {
                    required: "This field is required",
                  })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-white">Skills</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Key Skills
          </label>
          <input
            {...register("skills", { required: "Skills are required" })}
            placeholder="e.g. JavaScript, React, Python, Machine Learning, Project Management"
            className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            onChange={(e) => {
              // Convert comma-separated string to array
              const skillsArray = e.target.value
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "");

              const field = register("skills");
              // Use unknown assertion to safely bypass type checking
              field.onChange({
                target: { name: "skills", value: skillsArray },
              } as unknown as React.ChangeEvent<HTMLInputElement>);
            }}
          />
          {errors.skills && (
            <p className="mt-1 text-sm text-red-600">
              {/* @ts-expect-error - Property access in errors object */}
              {errors.skills.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Languages</h2>
          <button
            type="button"
            onClick={() =>
              appendLanguage({ language: "", proficiency: "Intermediate" })
            }
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Language
          </button>
        </div>

        {languageFields.map((field, index) => (
          <div
            key={field.id?.toString()}
            className="flex gap-4 items-center mb-2"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">
                Language
              </label>
              <input
                {...register(`languages.${index}.language` as const)}
                className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">
                Proficiency
              </label>
              {/* @ts-expect-error - Select incompatible with register return type */}
              <select
                {...register(`languages.${index}.proficiency` as const)}
                className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="mt-6 text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Target Position
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            What position are you targeting?
          </label>
          <input
            {...register("targetPosition", {
              required: "Target position is required",
            })}
            placeholder="e.g. Software Engineer, Project Manager, Data Scientist"
            className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.targetPosition && (
            <p className="mt-1 text-sm text-red-600">
              {/* @ts-expect-error - Property access in errors object */}
              {errors.targetPosition.message?.toString()}
            </p>
          )}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300">
            Additional Information
          </label>
          {/* @ts-expect-error - Textarea incompatible with register return type */}
          <textarea
            {...register("additionalInfo")}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Resume Template
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedTemplate === "modern"
                ? "border-blue-500 bg-blue-900/20"
                : "border-gray-600 hover:border-gray-500"
            }`}
            onClick={() => handleTemplateChange("modern")}
          >
            <input
              type="radio"
              {...register("template")}
              value="modern"
              className="hidden"
              id="modern-template"
              checked={selectedTemplate === "modern"}
            />
            <label
              htmlFor="modern-template"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-full h-20 bg-gray-600 mb-2 rounded flex items-center justify-center text-gray-400">
                Modern Preview
              </div>
              <span className="text-gray-300">Modern</span>
            </label>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedTemplate === "classic"
                ? "border-blue-500 bg-blue-900/20"
                : "border-gray-600 hover:border-gray-500"
            }`}
            onClick={() => handleTemplateChange("classic")}
          >
            <input
              type="radio"
              {...register("template")}
              value="classic"
              className="hidden"
              id="classic-template"
              checked={selectedTemplate === "classic"}
            />
            <label
              htmlFor="classic-template"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-full h-20 bg-gray-600 mb-2 rounded flex items-center justify-center text-gray-400">
                Classic Preview
              </div>
              <span className="text-gray-300">Classic</span>
            </label>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedTemplate === "creative"
                ? "border-blue-500 bg-blue-900/20"
                : "border-gray-600 hover:border-gray-500"
            }`}
            onClick={() => handleTemplateChange("creative")}
          >
            <input
              type="radio"
              {...register("template")}
              value="creative"
              className="hidden"
              id="creative-template"
              checked={selectedTemplate === "creative"}
            />
            <label
              htmlFor="creative-template"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-full h-20 bg-gray-600 mb-2 rounded flex items-center justify-center text-gray-400">
                Creative Preview
              </div>
              <span className="text-gray-300">Creative</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Resume...
            </>
          ) : (
            "Generate Resume"
          )}
        </button>
      </div>
    </form>
  );
}
