import { db } from "@/lib/firebase";
import {
  doc,
  runTransaction,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// Is for both favoriting and unfavoriting.
export const favoriteListing = async ({
  userId,
  listingId,
}: {
  userId: string;
  listingId: string;
}) => {
  const userRef = doc(db, "users", userId);
  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw "Document does not exist!";
      }
      const userData = userDoc.data();
      const favorites = userData.favorites || [];

      if (favorites.includes(listingId)) {
        transaction.update(userRef, { favorites: arrayRemove(listingId) });
      } else {
        transaction.update(userRef, { favorites: arrayUnion(listingId) });
      }
    });
    console.log("Transaction successfully committed!");
  } catch (e) {
    console.log("Transaction failed: ", e);
  }
};
