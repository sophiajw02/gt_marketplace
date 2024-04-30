import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const startConversation = async (
  userId: string,
  participantId: string,
) => {
  const conversationsRef = collection(db, "conversations");
  const q = query(
    conversationsRef,
    where("participants", "array-contains", userId),
  );

  const querySnapshot = await getDocs(q);
  let conversationExists = false;

  querySnapshot.forEach((doc) => {
    const participants = doc.data().participants;
    if (participants.includes(participantId)) {
      conversationExists = true;
    }
  });

  if (!conversationExists) {
    await addDoc(conversationsRef, {
      participants: [userId, participantId],
      createdAt: serverTimestamp(),
    });
  } else {
    console.log("Conversation already exists between these users.");
  }
};
