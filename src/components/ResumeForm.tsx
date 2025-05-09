import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ResumeFormData, TemplateType } from "@/types";

type ResumeFormProps = {
  onSubmit: (data: ResumeFormData) => void;
  isLoading: boolean;
};

export default function ResumeForm({ onSubmit, isLoading }: ResumeFormProps) {
  const [template, setTemplate] = useState<TemplateType>("modern");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeFormData>({
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
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
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: "education" });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: "experience" });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control, name: "languages" });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              {...register("personalInfo.fullName", {
                required: "This field is required",
              })}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {errors.personalInfo?.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personalInfo.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              {...register("personalInfo.email", {
                required: "This field is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {errors.personalInfo?.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personalInfo.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Phone
            </label>
            <input
              {...register("personalInfo.phone")}
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
              LinkedIn
            </label>
            <input
              {...register("personalInfo.linkedin")}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              GitHub
            </label>
            <input
              {...register("personalInfo.github")}
              className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
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
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>

        {educationFields.map((field: any, index: number) => (
          <div key={field.id} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Education #{index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
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
                  {...register(`education.${index}.institution`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.education?.[index]?.institution && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.institution?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Degree
                </label>
                <input
                  {...register(`education.${index}.degree`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.education?.[index]?.degree && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.degree?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Start Date
                </label>
                <input
                  {...register(`education.${index}.startDate`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.education?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  End Date
                </label>
                <input
                  {...register(`education.${index}.endDate`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.education?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.endDate?.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  {...register(`education.${index}.description`)}
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
          <h2 className="text-xl font-semibold">Work Experience</h2>
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
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>

        {experienceFields.map((field: any, index: number) => (
          <div key={field.id} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Experience #{index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
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
                  {...register(`experience.${index}.company`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.experience?.[index]?.company && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.company?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Position
                </label>
                <input
                  {...register(`experience.${index}.position`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.experience?.[index]?.position && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.position?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Start Date
                </label>
                <input
                  {...register(`experience.${index}.startDate`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.experience?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  End Date
                </label>
                <input
                  {...register(`experience.${index}.endDate`, {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.experience?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.endDate?.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">
                  Job Description
                </label>
                <textarea
                  {...register(`experience.${index}.description`, {
                    required: "This field is required",
                  })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.experience?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.description?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Skills</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            List of skills (comma separated)
          </label>
          <Controller
            name="skills"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }: { field: any }) => (
              <input
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((skill) => skill.trim())
                  )
                }
                value={field.value.join(", ")}
                className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            )}
          />
          {errors.skills && (
            <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
          )}
        </div>
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Languages</h2>
          <button
            type="button"
            onClick={() =>
              appendLanguage({ language: "", proficiency: "Intermediate" })
            }
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>

        {languageFields.map((field: any, index: number) => (
          <div key={field.id} className="flex gap-4 items-center mb-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">
                Language
              </label>
              <input
                {...register(`languages.${index}.language`)}
                className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">
                Proficiency
              </label>
              <select
                {...register(`languages.${index}.proficiency`)}
                className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="Basic">Basic</option>
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
                className="mt-6 text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">
          Target Position
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Desired Position
          </label>
          <input
            {...register("targetPosition", {
              required: "This field is required",
            })}
            className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.targetPosition && (
            <p className="mt-1 text-sm text-red-600">
              {errors.targetPosition.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300">
            Additional Information
          </label>
          <textarea
            {...register("additionalInfo")}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`border p-4 rounded-md cursor-pointer transition-all hover:shadow-md ${
              template === "modern"
                ? "border-blue-500 bg-gray-600"
                : "border-gray-600"
            }`}
            onClick={() => setTemplate("modern")}
          >
            <h3 className="font-medium mb-2 text-gray-200">Modern</h3>
            <p className="text-sm text-gray-400">
              Modern design with focus on skills and experience
            </p>
          </div>

          <div
            className={`border p-4 rounded-md cursor-pointer transition-all hover:shadow-md ${
              template === "classic"
                ? "border-blue-500 bg-gray-600"
                : "border-gray-600"
            }`}
            onClick={() => setTemplate("classic")}
          >
            <h3 className="font-medium mb-2 text-gray-200">Classic</h3>
            <p className="text-sm text-gray-400">
              Traditional design for conservative fields
            </p>
          </div>

          <div
            className={`border p-4 rounded-md cursor-pointer transition-all hover:shadow-md ${
              template === "creative"
                ? "border-blue-500 bg-gray-600"
                : "border-gray-600"
            }`}
            onClick={() => setTemplate("creative")}
          >
            <h3 className="font-medium mb-2 text-gray-200">Creative</h3>
            <p className="text-sm text-gray-400">
              Creative design for creative industries
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed border border-gray-500"
        >
          {isLoading ? "Generating..." : "Generate Resume"}
        </button>
      </div>
    </form>
  );
}
