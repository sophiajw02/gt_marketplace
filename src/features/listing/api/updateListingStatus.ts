import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const updateListingStatus = async (
  listingId: string,
  isActive: boolean,
) => {
  const docRef = doc(db, "listings", listingId);
  await updateDoc(docRef, { isActive: isActive });
};
