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
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Персональна інформація</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ПІБ
            </label>
            <input
              {...register("personalInfo.fullName", {
                required: "Це поле обов'язкове",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.personalInfo?.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personalInfo.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("personalInfo.email", {
                required: "Це поле обов'язкове",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Неправильний формат email",
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.personalInfo?.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personalInfo.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Телефон
            </label>
            <input
              {...register("personalInfo.phone")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Місто
            </label>
            <input
              {...register("personalInfo.location")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              LinkedIn
            </label>
            <input
              {...register("personalInfo.linkedin")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              GitHub
            </label>
            <input
              {...register("personalInfo.github")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Освіта</h2>
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
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Додати
          </button>
        </div>

        {educationFields.map((field, index) => (
          <div key={field.id} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Освіта #{index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Видалити
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Навчальний заклад
                </label>
                <input
                  {...register(`education.${index}.institution`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.education?.[index]?.institution && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.institution?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Спеціальність
                </label>
                <input
                  {...register(`education.${index}.degree`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.education?.[index]?.degree && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.degree?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Початок навчання
                </label>
                <input
                  {...register(`education.${index}.startDate`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.education?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Кінець навчання
                </label>
                <input
                  {...register(`education.${index}.endDate`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.education?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.endDate?.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Опис
                </label>
                <textarea
                  {...register(`education.${index}.description`)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Досвід роботи</h2>
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
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Додати
          </button>
        </div>

        {experienceFields.map((field, index) => (
          <div key={field.id} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Досвід #{index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Видалити
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Компанія
                </label>
                <input
                  {...register(`experience.${index}.company`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.experience?.[index]?.company && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.company?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Посада
                </label>
                <input
                  {...register(`experience.${index}.position`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.experience?.[index]?.position && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.position?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Початок роботи
                </label>
                <input
                  {...register(`experience.${index}.startDate`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.experience?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Кінець роботи
                </label>
                <input
                  {...register(`experience.${index}.endDate`, {
                    required: "Це поле обов'язкове",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.experience?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.endDate?.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Опис обов'язків
                </label>
                <textarea
                  {...register(`experience.${index}.description`, {
                    required: "Це поле обов'язкове",
                  })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Навички</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Список навичок (через кому)
          </label>
          <Controller
            name="skills"
            control={control}
            rules={{ required: "Це поле обов'язкове" }}
            render={({ field }) => (
              <input
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((skill) => skill.trim())
                  )
                }
                value={field.value.join(", ")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          />
          {errors.skills && (
            <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Мови</h2>
          <button
            type="button"
            onClick={() =>
              appendLanguage({ language: "", proficiency: "Intermediate" })
            }
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Додати
          </button>
        </div>

        {languageFields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-center mb-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Мова
              </label>
              <input
                {...register(`languages.${index}.language`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Рівень
              </label>
              <select
                {...register(`languages.${index}.proficiency`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Basic">Базовий</option>
                <option value="Intermediate">Середній</option>
                <option value="Advanced">Вище середнього</option>
                <option value="Fluent">Вільно</option>
                <option value="Native">Рідна</option>
              </select>
            </div>

            {index > 0 && (
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="mt-6 text-red-500 hover:text-red-700"
              >
                Видалити
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Цільова позиція</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Бажана посада
          </label>
          <input
            {...register("targetPosition", { required: "Це поле обов'язкове" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.targetPosition && (
            <p className="mt-1 text-sm text-red-600">
              {errors.targetPosition.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Додаткова інформація
          </label>
          <textarea
            {...register("additionalInfo")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Шаблон</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`border p-4 rounded-md cursor-pointer ${
              template === "modern" ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setTemplate("modern")}
          >
            <h3 className="font-medium mb-2">Сучасний</h3>
            <p className="text-sm text-gray-600">
              Сучасний дизайн з акцентом на навички та досвід
            </p>
          </div>

          <div
            className={`border p-4 rounded-md cursor-pointer ${
              template === "classic" ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setTemplate("classic")}
          >
            <h3 className="font-medium mb-2">Класичний</h3>
            <p className="text-sm text-gray-600">
              Традиційний дизайн для консервативних сфер
            </p>
          </div>

          <div
            className={`border p-4 rounded-md cursor-pointer ${
              template === "creative" ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setTemplate("creative")}
          >
            <h3 className="font-medium mb-2">Креативний</h3>
            <p className="text-sm text-gray-600">
              Креативний дизайн для творчих індустрій
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Генеруємо..." : "Згенерувати резюме"}
        </button>
      </div>
    </form>
  );
}
