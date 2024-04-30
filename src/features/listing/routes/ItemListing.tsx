import { useNavigate, useParams } from "react-router-dom";
import { useListing } from "../api/getListing";
import { ImageGallery } from "@/components/ImageGallery";
import { Spinner } from "@/components/Elements";
import { favoriteListing, updateListingStatus } from "../api/";
import { useAuth, useUser } from "@/hooks";
import { useEffect, useState } from "react";
import { startConversation } from "@/features/users/api";

export const ItemListing = () => {
  const { id } = useParams();
  const { listing, loading } = useListing(id ?? "");
  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const authorUser = useUser(listing?.author ?? "");
  const [isActive, setIsActive] = useState(listing?.isActive);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfFavorite = async () => {
      const status = user!.favorites.includes(id!);
      setIsFavorite(status!);
    };

    if (user && id) {
      checkIfFavorite();
    }
  }, [user, id]);

  useEffect(() => {
    if (listing) {
      setIsActive(listing.isActive);
    }
  }, [listing]);
  
  if (loading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleStatusChange = async (event) => {
    const isChecked = event.target.checked;
    await updateListingStatus(id ?? "", isChecked);
    setIsActive(isChecked);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div>
      <nav></nav>
      <section className="mt-5 bg-white antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="h-42 w-42 p-10 object-cover">
              <ImageGallery images={listing?.images ?? []} />
            </div>
            <div className="mt-5 mr-5">
              <h1 className="text-2xl font-semibold text-gray-900 truncate">
                {listing?.title}
              </h1>
              <div
                className="mt-3 py-3 px-3 border border-gray-200 rounded-md shadow-sm cursor-pointer"
                onClick={() => navigate(`/profile/${authorUser.user?.id}`)}
                id="sellerInfo"
              >
                <h2 className="text-md font-semibold text-black truncate">
                  Seller:{" "}
                  <span className="text-blue-800 underline font-semibold">
                    {authorUser.user?.name}
                  </span>
                </h2>
              </div>

              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  {formatPrice(listing?.price)}
                </p>
              </div>
              <h1 className="mt-3 font-semibold text-gray-900 truncate">
                Category: {listing?.tag ?? "None"}
              </h1>

              <div
                className={`${listing?.author == user?.firebaseUser.uid ? "" : "hidden"} mt-6 py-3 px-3 border border-gray-200 rounded-md shadow-sm cursor-pointer bg-gray-200`}
                id="listingActivity"
              >
                <p className="text-md font-semibold text-black truncate">
                  Your listing is currently:{" "}
                  <span
                    className={`${isActive ? "text-green-600" : "text-red-500"}`}
                  >
                    {isActive
                      ? "Visible to Other Users"
                      : "Hidden from Other Users"}
                  </span>
                </p>
                {/* <button
                    className="flex items-center justify-center py-2.5 px-5 mt-2 text-sm font-medium text-white focus:outline-none bg-navy-blue rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100" 
                  >
                    Edit Listing
                </button> */}
                <label
                  className={`${listing?.author == user?.firebaseUser.uid ? "" : "hidden"}  inline-flex items-center mt-2`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    className={`w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                    onChange={handleStatusChange}
                  />
                  <span className="ml-2">
                    Toggle Listing Availability (this button jank, can only set
                    active and not inactive)
                  </span>
                </label>
              </div>
              <div className="mt-2 sm:items-center sm:flex">
                <button
                  onClick={async () => {
                    await favoriteListing({
                      userId: user?.firebaseUser.uid ?? "",
                      listingId: listing?.id ?? "",
                    });
                    setIsFavorite(!isFavorite);
                  }}
                  className={`${listing?.author == user?.firebaseUser.uid ? "hidden" : ""} mr-2 flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-navy-blue rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100`}
                >
                  <svg
                    className={`w-5 h-5 -ms-2 me-2 ${!isFavorite ? "" : "fill-current text-white"}`} // Adjust SVG styling based on favorite status
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke={isFavorite ? "currentColor" : "white"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        isFavorite
                          ? "M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                          : "M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                      } // Use the same path for simplicity, adjust as needed
                    />
                  </svg>
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>

                <button
                  onClick={() => {
                    startConversation(
                      user?.firebaseUser.uid ?? "",
                      listing?.author ?? "",
                    ).then(() => navigate("/chat"));
                  }}
                  className={`${listing?.author == user?.firebaseUser.uid ? "hidden" : ""} text-white bg-navy-blue mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-3000 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none flex items-center justify-center`}
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
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                    />
                  </svg>
                  Contact Seller
                </button>
              </div>

              <hr className="my-4 border-gray-800" />
              <h1 className="mb-1 font-semibold text-xl">Description</h1>
              <p className="mb-6 text-gray-600">{listing?.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
