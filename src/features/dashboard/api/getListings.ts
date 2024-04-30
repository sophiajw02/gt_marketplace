import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import type { Listing } from "@/types";

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, "listings"), where("isActive", "==", true));
    const fetchListings = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(q);
        const newlistings: Listing[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          newlistings.push({
            ...data,
            id: doc.id,
            tag: data.tag ?? "",
          } as Listing);
        });
        setListings(newlistings);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return { listings, loading, error };
};
