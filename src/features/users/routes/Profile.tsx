import { startConversation, useListings } from "../api";
import { useUser, useAuth } from "@/hooks";
import { Spinner } from "@/components/Elements/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { SingleListing } from "@/components/SingleListing";

export const Profile = () => {
  const { id } = useParams();
  const { user } = useUser(id ?? "");
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const listings = useListings(id ?? "");

  if (listings.loading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex flex-wrap items-center justify-center">
      {/* User Avatar */}
      <div className="w-fit px-4 py-5 sm:px-6">
        <div className="w-44 h-44 overflow-hidden rounded-full shadow shadow-lg ring-1 ring-black">
          {/* Images need to be square */}
          <img
            className="w-full h-full object-cover"
            src={user?.profilePicture}
          />
        </div>
      </div>
      {/* User Information: Name, Year, Major, Sales, etc. */}
      <div className="px-4 py-5 sm:px-6 w-2/12">
        <h1 className="text-3xl leading-8 text-gray-900 font-semibold mb-2">
          {user?.name ?? "George P. Burdell"}
        </h1>
        <p className="text-lg">{user?.major}</p>
        <p className="text-lg">{user?.year}</p>
        {/* TODO: Route this button to settings */}
        <div className="flex justify-content my-2">
          {currentUser?.firebaseUser.uid !== id && (
            <div className="flex justify-content my-2">
              <button
                onClick={() => {
                  startConversation(
                    currentUser?.firebaseUser.uid ?? "",
                    id ?? "",
                  ).then(() => navigate("/chat"));
                }}
                className="text-white bg-navy-blue text-sm bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-3000 focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 focus:outline-none flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 -ms-2 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"
                  />
                </svg>
                Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favorited Listings of individual user only */}
      <div
        className={`${currentUser?.firebaseUser.uid == id ? "" : "hidden"} w-full px-32`}
      >
        <h1 className="flex flex-wrap text-3xl font-bold my-3">
          Your Favorited Listings
        </h1>
        <hr className="h-px my-3 bg-gray-400 border-0 shadow"></hr>
        <div className="flex flex-wrap">
          {listings.listings.map((listing) => (
            <SingleListing listing={listing} />
          ))}
        </div>
      </div>

      {/* If not currentUser profile, show all created listings of current profile */}
      {/* TODO: CHANGE TO SHOW THE CORRECT LISTINGS OF THE ID'S CREATED LISTINGS */}
      <div
        className={`${currentUser?.firebaseUser.uid != id ? "" : "hidden"} w-full px-32`}
      >
        <h1 className="flex flex-wrap text-3xl font-bold my-3">
          {user?.name}'s Listings
        </h1>
        <hr className="h-px my-3 bg-gray-400 border-0 shadow"></hr>
        <div className="flex flex-wrap">
          {listings.listings.map((listing) => (
            <SingleListing listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};
