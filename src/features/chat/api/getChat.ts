import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "../types";

export const useMessages = (userId: string, participantId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // First, find the conversationId
    const findConversationId = async () => {
      const conversationsQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId),
      );
      try {
        const querySnapshot = await getDocs(conversationsQuery);
        const conversation = querySnapshot.docs
          .map(
            (doc) =>
              ({ ...doc.data(), id: doc.id }) as {
                participants: string[];
                id: string;
              },
          )
          .find((doc) => doc.participants.includes(participantId));

        if (conversation) {
          return conversation.id;
        } else {
          throw new Error("Conversation not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to find conversation"),
        );
        setLoading(false);
        return null;
      }
    };
    findConversationId().then((conversationId) => {
      if (conversationId) {
        // Once conversationId is found, fetch messages
        const messagesQuery = query(
          collection(db, "messages"),
          where("conversationId", "==", conversationId),
          orderBy("createdAt", "asc"),
        );

        const unsubscribe = onSnapshot(
          messagesQuery,
          (querySnapshot: QuerySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              const message = {
                ...data,
                id: doc.id,
                createdAt: data.createdAt
                  ? data.createdAt.toDate()
                  : new Date(),
              } as Message;
              return message;
            });

            setMessages(fetchedMessages);
            setLoading(false);
          },
          (err) => {
            setError(err);
            setLoading(false);
          },
        );

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    });
  }, [userId, participantId]);

  return { messages, loading, error };
};
