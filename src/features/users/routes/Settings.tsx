import { TextField } from "@/components/Elements";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { putProfile } from "../api";
import React, { useState } from "react";

const settingsSchema = z.object({
  name: z.string().min(1),
  major: z.string().min(1),
  year: z.enum(["", "Freshman", "Sophomore", "Junior", "Senior", "Graduate"]),
  profilePicture: z.instanceof(File).optional(),
});

export const Settings = () => {
  const { user } = useAuth();
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
  } = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.firebaseUser.displayName ?? "",
      major: user?.major ?? "",
      year: user?.year,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof settingsSchema>> = async (
    data,
  ) => {
    setSubmissionStatus("");
    setSubmissionError("");

    if (!touchedFields.profilePicture) {
      delete data.profilePicture;
    }

    try {
      await putProfile(user!, data);
      setSubmissionStatus("Profile updated successfully!");
      setSubmissionError("");
    } catch (error) {
      setSubmissionStatus("");
      setSubmissionError("Failed to update profile. Please try again.");
    }
  };

  return (
    <section>
      {/* border border-gray-500  */}
      <div className="max-w-2xl px-8 mt-5 mx-auto">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="user_avatar"
              >
                Upload Profile Picture
              </label>
              <Controller
                name="profilePicture"
                control={control}
                render={({ field: { value, ...restField } }) => (
                  <input
                    {...restField}
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    type="file"
                    accept="image/*"
                    onChange={(e) => restField.onChange(e.target.files[0])}
                  />
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                name="name"
                label="Name"
                register={register}
                errors={errors}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                name="major"
                label="Major"
                register={register}
                errors={errors}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Class
              </label>
              <select
                {...register("year")}
                id="year"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              >
                <option value="">Select Year</option>{" "}
                {/* Add this line if you want a default "empty" option */}
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
              {errors.year && (
                <p className="text-red-500">{errors.year.message}</p>
              )}
            </div>
          </div>
          {/* TODO: Button currently linked to return to home page, reroute to update user */}
          <div className="flex items-center space-x-4 py-2">
            <button
              type="submit"
              className="text-white bg-navy-blue hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Update Profile
            </button>
            {submissionStatus && (
              <p className="text-green-500">{submissionStatus}</p>
            )}
            {submissionError && (
              <p className="text-red-500 text-semibold">{submissionError}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
