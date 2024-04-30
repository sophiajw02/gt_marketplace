import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import type { ProfileData } from "@/types";
import { updateProfile } from "firebase/auth";
import type { UserData } from "@/types";

export const putProfile = async (user: UserData, data: ProfileData) => {
  try {
    const updateData = {
      name: data.name,
      major: data.major,
      year: data.year,
    };

    if (data.profilePicture) {
      const imageUrl = await uploadImage(data.profilePicture as File);
      updateData.profilePicture = imageUrl;
    }

    await updateProfile(user.firebaseUser, { displayName: data.name });
    const userDocRef = doc(db, "users", user.firebaseUser.uid);
    const docSnapshot = await getDoc(userDocRef);
    await updateDoc(docSnapshot.ref, updateData);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw new Error("Error updating document in Firestore");
  }
};

export const uploadImage = async (imageBlob: Blob): Promise<string> => {
  const imageRef = ref(storage, `images/${Date.now()}`);
  const snapshot = await uploadBytes(imageRef, imageBlob);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
