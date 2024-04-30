import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import type { Listing } from "@/types";
import { useAuth } from "@/hooks";

export const useListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "listings"),
      where("author", "==", user.firebaseUser.uid),
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const newlistings: Listing[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          newlistings.push({ ...data, id: doc.id } as Listing);
        });
        setListings(newlistings);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user]);

  return { listings, loading, error };
};
