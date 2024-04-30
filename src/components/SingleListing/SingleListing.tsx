import { Listing } from "@/types";
import { useNavigate } from "react-router-dom";

export const SingleListing = ({ listing }: { listing: Listing }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div
      key={listing.id}
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 cursor-pointer"
    >
      <div className="flex flex-col border rounded-lg overflow-hidden bg-white shadow ">
        {/* TODO: get image[0] from listing */}
        <img
          className="h-52 w-full object-cover"
          src={
            listing.images
              ? listing.images[0]
              : "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=384"
          }
        />
        <div className="flex-1 px-6 py-4">
          <div className="font-bold text-xl mb-1 truncate">{listing.title}</div>
          {/* TODO: redirect to ind listings, get price */}
          {/* <p className="text-gray-700 text-base truncate mb-2"><span className="font-bold">Seller:</span> {listing.author}</p> */}
          <p className="text-gray-700 text-base truncate font-bold text-lg">
            {formatPrice(listing.price)}
          </p>
        </div>
      </div>
    </div>
  );
};
