import { useAuth } from "@/hooks";
import { useListings } from "../api/getListings";
import { Spinner, Modal, TextField } from "@/components/Elements";
import React, { useState, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import type { PostListing } from "../types";
import { postListing } from "../api/postListing";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleListing } from "@/components/SingleListing";

const postListingSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than 0" })
    .multipleOf(0.01, { message: "Input a valid price" }),
  description: z.string(),
  tag: z.string().optional(), // Assuming tag is optional
  images: z
    .array(z.any())
    .refine((images) => images.filter(Boolean).length > 0, {
      message: "At least one image is required",
    }),
});

export const Sell = () => {
  const { user } = useAuth();
  const listings = useListings();

  const [isOpen, setIsOpen] = useState(false);
  const [showCreatedPopup, setShowCreatedPopup] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void,
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      onChange(null);
      return;
    }
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    } else {
      onChange(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    onChange: (file: File | null) => void,
  ) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length > 0) {
      onChange(files[0]);
    } else {
      onChange(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const triggerFileInput = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
      fileInputRefs.current[index]!.click();
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof postListingSchema>>({
    resolver: zodResolver(postListingSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof postListingSchema>> = async (
    data,
  ) => {
    console.log("Form submitted", data);
    try {
      const completeData = {
        ...data,
        author: user?.firebaseUser.uid ?? "",
        createdAt: new Date(),
        status: "available",
      } as PostListing;
      await postListing(completeData);
      setIsOpen(false);
      setShowCreatedPopup(true);
      setTimeout(() => setShowCreatedPopup(false), 1500);
      reset();
    } catch (error) {
      console.error("Failed to post listing:", error);
    }
  };

  if (listings.loading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-28 p-4">
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4 p-4">
          <div className="flex-1">
            <Controller
              name="images.0"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div
                  onClick={() => triggerFileInput(0)}
                  onDrop={(e) => handleDrop(e, onChange)}
                  onDragOver={handleDragOver}
                  className="w-full h-64 bg-gray-200 flex justify-center items-center cursor-pointer mb-4"
                  style={{ minHeight: "250px" }}
                >
                  {value ? (
                    <div className="w-full h-full flex justify-center items-center relative">
                      <img
                        src={URL.createObjectURL(value)}
                        alt="Primary Image"
                        className="max-w-full max-h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(null);
                          if (fileInputRefs.current[0]) {
                            fileInputRefs.current[0].value = "";
                          }
                        }}
                        className="absolute top-0 right-0 w-8 h-8 bg-red-500 text-center text-white p-1 rounded-xl"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="lightgray"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-plus"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  )}
                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[0] = el)}
                    onChange={(e) => handleImageChange(e, onChange)}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </div>
              )}
            />
            <div className="flex flex-wrap mx-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Controller
                  key={index + 1}
                  name={`images.${index + 1}`}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <div className="px-2 mb-4">
                      <div
                        onClick={() => triggerFileInput(index + 1)}
                        onDrop={(e) => handleDrop(e, onChange)}
                        onDragOver={handleDragOver}
                        className="w-full h-full bg-gray-200 flex justify-center items-center cursor-pointer"
                      >
                        {value ? (
                          <div className="w-14 h-14 flex justify-center items-center relative">
                            <img
                              src={URL.createObjectURL(value)}
                              alt={`Image ${index + 1}`}
                              className="max-w-full max-h-full object-covers"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onChange(null);

                                if (fileInputRefs.current[index + 1]) {
                                  fileInputRefs.current[index + 1].value = "";
                                }
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <svg
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="lightgray"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-plus"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        )}
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[index + 1] = el)}
                          onChange={(e) => handleImageChange(e, onChange)}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                      </div>
                      {error && <p className="text-red-500">{error.message}</p>}
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <TextField
              name="title"
              label="Title"
              register={register}
              errors={errors}
            />
            <TextField
              name="price"
              label="Price ($)"
              register={register}
              errors={errors}
            />
            <div className="mt-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description <span className="font-normal">(Optional)</span>
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="resize-none mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Listing Description"
              ></textarea>
            </div>
            <div className="mt-4">
              <label
                htmlFor="tag"
                className="block text-sm font-medium text-gray-700"
              >
                Tag
              </label>
              <select
                {...register("tag")}
                id="tag"
                name="tag"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                {[
                  "None",
                  "Apparel",
                  "Bedroom",
                  "Bathroom",
                  "Electronics",
                  "Kitchen",
                  "Office & School Supplies",
                  "Toys & Games",
                ].map((category) => (
                  <option value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button
              className="mt-4 bg-navy-blue text-white p-4 rounded-md hover:bg-navy-hover"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {showCreatedPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-md">
          Listing Created
        </div>
      )}

      <div className="w-10/12 flex flex-row justify-between ml-auto mr-auto">
        <h1 className="text-3xl font-bold">Your Listings</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="w-auto text-white bg-navy-blue hover:bg-navy-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center"
        >
          Add New Listing
        </button>
      </div>
      <div className="flex flex-wrap">
        {listings.listings.length > 0 ? (
          listings.listings.map((listing) => (
            <SingleListing key={listing.id} listing={listing} />
          ))
        ) : (
          <p className="text-center w-full mt-5 text-gray-500 text-lg font-semibold">
            You have no listings created.
          </p>
        )}
      </div>
    </div>
  );
};
