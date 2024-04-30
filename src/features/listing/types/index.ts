import type { Listing } from "@/types";
export type PostListing = Omit<Listing, "id" | "images"> & { images: File[] };
