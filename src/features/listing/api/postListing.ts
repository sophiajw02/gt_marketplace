import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { PostListing } from "../types";

export const uploadImage = async (imageBlob: Blob): Promise<string> => {
  const imageRef = ref(storage, `images/${Date.now()}`);
  const snapshot = await uploadBytes(imageRef, imageBlob);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

export const uploadImages = async (images: Blob[]): Promise<string[]> => {
  const uploadPromises = images.map((image) =>
    image ? uploadImage(image) : Promise.resolve(""),
  );
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls.filter((url) => url !== "");
};

export const postListing = async (data: PostListing) => {
  try {
    const images = await uploadImages(data.images);
    const listingData = { ...data, images, isActive: true };
    const docRef = await addDoc(collection(db, "listings"), listingData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Error adding document to Firestore");
  }
};
