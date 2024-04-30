import { SingleListing } from "@/components/SingleListing";
import { useListings } from "../api/getListings";
import { Spinner } from "@/components/Elements";
import { useState } from "react";

export const Dashboard = () => {
  const listings = useListings();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = listings.listings
    ? Math.ceil(listings.listings.length / pageSize)
    : 3;

  const handleCategoryClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const filteredListings = listings.listings.filter(
    (listing) =>
      (selectedTag ? listing.tag === selectedTag : true) &&
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedData = filteredListings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (listings.loading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-68px)] flex flex-row justify-center">
      <nav></nav>
      {/* Filters | insert categories */}
      <div className="h-[calc(100vh-88px)] w-1/5">
        <h1 className="mx-4 mt-5 text-2xl font-semibold">Categories</h1>
        <hr className="h-px mx-2 my-3 bg-gray-400 border-0 shadow"></hr>
        <ul className="space-y-2 font-medium">
          {[
            "Apparel",
            "Bedroom",
            "Bathroom",
            "Electronics",
            "Kitchen",
            "Office & School Supplies",
            "Toys & Games",
          ].map((category) => (
            <li
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer flex items-center justify-between p-2 rounded-lg ${
                selectedTag === category ? "bg-gray-200" : ""
              }`}
            >
              <span className="flex items-center">
                <span className="ml-3">{category}</span>
              </span>
              {selectedTag === category && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the category click handler from firing
                    setSelectedTag(null);
                  }}
                  className="ml-2 inline-flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-11/12">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold px-9 mt-5">All Listings</h1>
          <div className="flex items-center gap-x-2" id="search-container">
          <div className="h-10 mt-4 inline-flex items-stretch -space-x-px">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="ml-0 flex h-full items-center justify-center rounded-l-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 disabled:bg-gray-200"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex h-full items-center justify-center rounded-r-lg border border-gray-300 bg-white px-3 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 disabled:bg-gray-200"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            <div className="pr-10">

              <div className="relative inset-y-7 flex ps-3 pointer-events-none">
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
                className="block w-60 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap px-4 py-5">
          {paginatedData.map((listing) => (
            <SingleListing key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};
