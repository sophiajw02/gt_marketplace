import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

type TextFieldProps = {
  name: string;
  label: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
  type?: string;
  validationRules?: object;
  placeholder?: string;
};

export const TextField = ({
  name,
  label,
  register,
  errors,
  required = false,
  type = "text",
  validationRules = {},
  placeholder = "",
}: TextFieldProps) => {
  return (
    <div>
      <label
        className="block mb-2 text-sm font-medium text-gray-900"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        id={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        placeholder={placeholder}
        type={type}
        {...register(name, { required, ...validationRules })}
      />
      {errors[name] && typeof errors[name]!.message === "string" && (
        <p className="text-red-500 text-sm">
          {errors[name]!.message as string}
        </p>
      )}
    </div>
  );
};
