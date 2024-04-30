import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDoc,
  doc,
  where,
  getDocs,
  documentId,
} from "firebase/firestore";
import type { Listing } from "@/types";

export const useListings = (id: string) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFavoritesAndListings = async () => {
      try {
        const userDocRef = doc(db, "users", id);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw new Error("User not found");
        }
        const userData = userDoc.data();
        const favorites = userData?.favorites as string[];

        if (!favorites || favorites.length === 0) {
          setListings([]);
          setLoading(false);
          return;
        }

        const listingsCollectionRef = collection(db, "listings");
        const listingsQuery = query(
          listingsCollectionRef,
          where(documentId(), "in", favorites),
        );
        const querySnapshot = await getDocs(listingsQuery);
        const newlistings: Listing[] = querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as Listing,
        );
        setListings(newlistings);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritesAndListings();
  }, [id]); // Dependency array includes id to refetch if it changes

  return { listings, loading, error };
};
