import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ProfileData } from "@/types";

export const useUser = (id: string) => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, "users", id);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw new Error("User data not found");
        }
        const userData = userDoc.data();
        if (!userData) {
          throw new Error("User data is undefined");
        }
        setUser({
          id: userDoc.id,
          name: userData.name,
          major: userData.major,
          year: userData.year,
          profilePicture: userData.profilePicture,
          favorites: userData.favorites,
        } as ProfileData);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, loading, error };
};
