import { useAuth } from "@/hooks";
import { NavLink, Link } from "react-router-dom";
import React, { useState } from "react";
import { Modal } from "./Elements";
import { postFeedback } from "@/features/dashboard/api";

// // Use this to implement dropdown Sign out later
// export const Dashboard = () => {
//   const { logoutFn } = useAuth();
// };

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logoutFn, user } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [appRating, setAppRating] = useState(5);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleFeedbackFormSubmit = async () => {
    await postFeedback(
      { feedbackText, appRating },
      user?.firebaseUser.uid ?? "",
    );
    setIsFeedbackModalOpen(false);
  };

  return (
    <div className="bg-white">
      <nav className="flex justify-between items-center p-2 bg-tech-gold drop-shadow-md">
        <div className="items-start flex flex-wrap items-start justify-between">
          <Link to="/" className="flex items-center space-x-3 my-1 ml-2">
            <svg
              className="w-11 h-11"
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
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Georgia Tech Marketplace
            </span>
          </Link>
        </div>
        {/* SEARCH BAR */}
        {/* <div className="flex md:order-1">
          <button
            type="button"
            data-collapse-toggle="navbar-search"
            aria-controls="navbar-search"
            aria-expanded="false"
            className="md:hidden text-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5 me-1"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-80 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-search"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div> */}
        {/* HOME | SELL */}
        <div
          className="items-center justify-between flex flex-wrap hidden w-auto md:flex md:order-2"
          id="navbar-sticky"
        >
          <ul className="flex flex-col pr-2 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "w-auto text-white block py-1 px-2 text-center text-white rounded md:hover:text-navy-blue md:border-solid md:hover:border-navy-blue border-2"
                    : "w-auto text-white block py-1 px-2 text-white rounded md:hover:text-navy-blue"
                }
              >
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sell"
                className={({ isActive }) =>
                  isActive
                    ? "w-auto text-white block py-1 px-2 text-center text-white rounded md:hover:text-navy-blue md:border-solid md:hover:border-navy-blue border-2"
                    : "w-auto text-white block py-1 px-2 text-white rounded md:hover:text-navy-blue"
                }
              >
                {" "}
                Sell{" "}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  isActive
                    ? "w-auto text-white block py-1 px-2 text-center text-white rounded md:hover:text-navy-blue md:border-solid md:hover:border-navy-blue border-2"
                    : "w-auto text-white block py-1 px-2 text-white rounded md:hover:text-navy-blue"
                }
              >
                {" "}
                Chat{" "}
              </NavLink>
            </li>
          </ul>
          {/* USER PROFILE + DROPDOWN NAV */}
          <div
            className="flex items-center px-4 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
            id="dropdownContainer"
          >
            <button
              type="button"
              onClick={toggleDropdown} // Add onClick handler here
              className="flex text-sm bg-gray-800 rounded-full md:me-0 hover:ring-2 hover:ring-navy-blue"
              aria-expanded={isDropdownOpen} // Controlled by state
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-11 h-11 object-cover rounded-full"
                src={user?.profilePicture ?? ""}
                alt="user photo"
              />
            </button>
            {isDropdownOpen && ( // Conditional rendering based on state
              <div
                className="z-50 my-2 text-base list-none bg-navy-hover divide-y divide-navy-line rounded-lg shadow w-48 mt-2 absolute" // Adjust width as necessary
                style={{ top: "70%", right: 10 }} // Position it below the button
                id="dropdownMenu"
              >
                <div className="px-4 py-3">
                  <span className="block font-bold text-sm text-white">
                    {user?.name}
                  </span>
                  <span className="block font-semibold text-sm text-gray-400 truncate">
                    {user?.major}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <Link
                      to={`/profile/${user?.firebaseUser.uid}`}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-navy-line hover:text-white hover:font-semibold"
                      onClick={closeDropdown}
                    >
                      Profile & Favorites
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-navy-line hover:text-white hover:font-semibold"
                      onClick={closeDropdown}
                    >
                      User Settings
                    </Link>
                  </li>
                </ul>

                <div className="py-2">
                  <a
                    href="#"
                    className="block px-4 py-2 font-bold text-sm text-red-400 hover:bg-navy-line hover:underline"
                    onClick={logoutFn}
                  >
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main id="pageContent">
        <button
          onClick={() => {
            setIsFeedbackModalOpen(true);
          }}
          className="fixed bottom-4 left-4 p-2 w-auto h-12 rounded-full bg-tech-gold flex flex-wrap items-center justify-center shadow-md"
          style={{ zIndex: 1000 }}
        >
          <svg
            className="w-5 h-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6m0-6v6m0-6 5.419-3.87A1 1 0 0 1 18 5.942v12.114a1 1 0 0 1-1.581.814L11 15m7 0a3 3 0 0 0 0-6M6 15h3v5H6v-5Z"
            />
          </svg>
          <p className="text-white font-semibold text-md mx-2">Feedback</p>
        </button>
        {children}
      </main>

      <Modal
        className="max-w-[500px]"
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
        }}
      >
        <div className="flex flex-col items-center justify-center p-4 gap-y-5">
          <h1 className="mb-4 text-2xl font-bold">Feedback?</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFeedbackFormSubmit();
            }}
          >
            <div className="text-left w-full">
              <p className="mb-2 font-semibold">
                On a scale from 1 to 5, how do you feel about our app?
              </p>
              <div className="flex justify-between mb-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="serviceRating"
                      value={appRating}
                      onChange={(e) => setAppRating(Number(e.target.value))}
                      className="form-radio"
                    />
                    <span className="ml-2">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="block p-2.5 w-96 h-40 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Your feedback..."
            ></textarea>
            <button
              type="submit"
              className="mt-4 text-white bg-navy-blue hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
