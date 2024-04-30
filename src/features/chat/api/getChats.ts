import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProfileData } from "@/types";
import { Conversation } from "../types";

export const useLastMessageForConversations = (userId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRefs = useRef<(() => void)[]>([]); // Store unsubscribe functions for cleanup

  useEffect(() => {
    setLoading(true);
    const conversationsQuery = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId),
    );

    const unsubscribeConversations = onSnapshot(
      conversationsQuery,
      async (conversationsSnapshot) => {
        const updatedConversations: Conversation[] = [];

        for (const docSnapshot of conversationsSnapshot.docs) {
          const conversationData = {
            ...docSnapshot.data(),
            conversationId: docSnapshot.id,
            createdAt: docSnapshot.data().createdAt.toDate(),
          } as {
            conversationId: string;
            createdAt: Date;
            participants: string[];
          };

          // Fetch user details for each participant
          const participantDetails = await Promise.all(
            conversationData.participants
              .filter((participantId) => participantId !== userId)
              .map(async (participantId) => {
                const userDocRef = doc(db, "users", participantId);
                const userDocSnap = await getDoc(userDocRef);
                return userDocSnap.exists()
                  ? {
                      ...(userDocSnap.data() as Omit<ProfileData, "id">),
                      id: userDocSnap.id,
                    }
                  : null;
              }),
          );

          const filteredParticipants = participantDetails.filter(Boolean);

          // Prepare to fetch the last message for each conversation
          const messagesQuery = query(
            collection(db, "messages"),
            where("conversationId", "==", conversationData.conversationId),
            orderBy("createdAt", "desc"),
            limit(1),
          );

          // Use onSnapshot to listen for real-time updates
          const unsubscribeMessage = onSnapshot(
            messagesQuery,
            (messagesSnapshot) => {
              const lastMessageData = messagesSnapshot.docs[0]?.data();
              const conversationIndex = updatedConversations.findIndex(
                (c) => c.conversationId === conversationData.conversationId,
              );
              if (conversationIndex !== -1) {
                updatedConversations[conversationIndex].lastMessage =
                  lastMessageData ? lastMessageData.content : "";
                updatedConversations[conversationIndex].lastMessageCreatedAt =
                  lastMessageData ? lastMessageData.createdAt.toDate() : null;
                setConversations([...updatedConversations]); // Update state to trigger re-render
              }
            },
          );

          unsubscribeRefs.current.push(unsubscribeMessage); // Add to refs for cleanup

          updatedConversations.push({
            ...conversationData,
            participants: filteredParticipants,
            lastMessage: "", // Initialized as empty, will be updated by onSnapshot
            lastMessageCreatedAt: null,
          });
        }

        setConversations(updatedConversations);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubscribeConversations();
      unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    };
  }, [userId]);

  return { conversations, loading, error };
};
