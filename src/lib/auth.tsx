import {
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  sendEmailVerification,
} from "firebase/auth";
import { createContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import type { UserData } from "@/types";

const loginFn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw new Error("Error logging in");
  }
};

const logoutFn = async () => {
  try {
    const user = await signOut(auth);
    return user;
  } catch (error) {
    throw new Error("Error logging out");
  }
};

const registerFn = async (
  email: string,
  password: string,
  displayName: string,
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;
  if (user) {
    await updateProfile(user, {
      displayName: `${displayName}`,
    });
  }

  await setDoc(doc(db, "users", user.uid), {
    name: displayName,
    profilePicture:
      "https://firebasestorage.googleapis.com/v0/b/cs-4675.appspot.com/o/images%2Fdefault_profile_pic.jpg?alt=media&token=52f5f822-3f4e-48ed-8d2e-a625fe12cc7d",
    favorites: [],
    major: "",
    year: "",
  });

  return user;
};

const verifyFn = async (user: User) => {
  try {
    console.log("hi hello", user);
    sendEmailVerification(user);
  } catch (error) {
    throw new Error("Error in email verification");
  }
};

const useLoadUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          const userData = doc.data();
          if (userData) {
            setUser({
              firebaseUser,
              name: userData.name,
              profilePicture: userData.profilePicture,
              major: userData.major,
              year: userData.year,
              favorites: userData.favorites,
            });
          } else {
            console.error("User data not found");
          }
          setLoading(false);
        });

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return { user, loading };
};

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  loginFn: (email: string, password: string) => Promise<User>;
  verifyFn: (user: User) => Promise<void>;
  registerFn: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<User>;
  logoutFn: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useLoadUser();

  const value: AuthContextType = {
    user,
    loading,
    loginFn,
    verifyFn,
    registerFn,
    logoutFn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
