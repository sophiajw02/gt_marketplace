import { useAuth } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/Elements";

const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(/@gatech\.edu$/, "Email must end with @gatech.edu"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(1, "Display name must be at least 1 character"),
});

export const Register = () => {
  const { user, registerFn, verifyFn } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/");
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const user = await registerFn(
        data.email,
        data.password,
        data.displayName,
      );
      await verifyFn(user);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email already in use.",
        });
      }
      console.error(error);
    }
  });

  return (
    <section className="bg-tech-gold">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-10 text-3xl font-semibold text-white drop-shadow-sm"
        >
          {/* REPLACE SRC WITH PROPER SVG */}
          <svg
            className="w-11 h-11 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.87617 3.75H19.1238L21 8.86683V10.5C21 11.2516 20.7177 11.9465 20.25 12.4667V21H3.75V12.4667C3.28234 11.9465 3 11.2516 3 10.5V8.86683L4.87617 3.75ZM18.1875 13.3929C18.3807 13.3929 18.5688 13.3731 18.75 13.3355V19.5H15V15H9L9 19.5H5.25V13.3355C5.43122 13.3731 5.61926 13.3929 5.8125 13.3929C6.63629 13.3929 7.36559 13.0334 7.875 12.4667C8.38441 13.0334 9.11371 13.3929 9.9375 13.3929C10.7613 13.3929 11.4906 13.0334 12 12.4667C12.5094 13.0334 13.2387 13.3929 14.0625 13.3929C14.8863 13.3929 15.6156 13.0334 16.125 12.4667C16.6344 13.0334 17.3637 13.3929 18.1875 13.3929ZM10.5 19.5H13.5V16.5H10.5L10.5 19.5ZM19.5 9.75V10.5C19.5 11.2965 18.8856 11.8929 18.1875 11.8929C17.4894 11.8929 16.875 11.2965 16.875 10.5V9.75H19.5ZM19.1762 8.25L18.0762 5.25H5.92383L4.82383 8.25H19.1762ZM4.5 9.75V10.5C4.5 11.2965 5.11439 11.8929 5.8125 11.8929C6.51061 11.8929 7.125 11.2965 7.125 10.5V9.75H4.5ZM8.625 9.75V10.5C8.625 11.2965 9.23939 11.8929 9.9375 11.8929C10.6356 11.8929 11.25 11.2965 11.25 10.5V9.75H8.625ZM12.75 9.75V10.5C12.75 11.2965 13.3644 11.8929 14.0625 11.8929C14.7606 11.8929 15.375 11.2965 15.375 10.5V9.75H12.75Z"
                fill="#003057"
              ></path>
            </g>
          </svg>
          Georgia Tech Marketplace
        </a>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-3xl">
              Create an Account
            </h1>
            <form
              onSubmit={onSubmit}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <TextField
                name="displayName"
                label="Your Name"
                register={register}
                errors={errors}
              />
              <TextField
                name="email"
                label="GT Email"
                register={register}
                errors={errors}
              />
              <TextField
                name="password"
                type="password"
                label="Password"
                register={register}
                errors={errors}
              />
              <TextField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                register={register}
                errors={errors}
              />
              <button
                className="w-full text-white bg-navy-blue hover:bg-navy-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                type="submit"
              >
                Submit
              </button>

              <p className="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <Link
                  to="../login"
                  className="text-navy-blue font-medium text-primary-600 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
