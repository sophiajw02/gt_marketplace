import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const postChat = async (
  conversationId: string,
  senderId: string,
  content: string,
) => {
  await addDoc(collection(db, "messages"), {
    conversationId,
    sender: senderId,
    content: content,
    createdAt: serverTimestamp(),
  });
};
