import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import type { Listing } from "@/types";

export const useListing = (id: string) => {
  const [listing, setListing] = useState<Listing>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const listingDocRef = doc(db, "listings", id);
        const docSnapshot = await getDoc(listingDocRef);
        setListing({ ...docSnapshot.data(), id } as Listing);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  return { listing, loading, error };
};
