import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export const postFeedback = async (
  { feedbackText, appRating }: { feedbackText: string; appRating: number },
  userId: string,
) => {
  try {
    const docRef = await addDoc(collection(db, "feedback"), {
      feedback: feedbackText,
      rating: appRating,
      user: userId,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Error adding document to Firestore");
  }
};
