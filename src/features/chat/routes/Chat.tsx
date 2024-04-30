import { useAuth } from "@/hooks";
import { SingleChat } from "../components/SingleChat";
import { useLastMessageForConversations } from "../api";
import { useState, useEffect, useRef } from "react";
import { Conversation } from "../types";

export const Chat = () => {
  const { user } = useAuth();
  const chats = useLastMessageForConversations(user?.firebaseUser.uid ?? "");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const defaultConversationSet = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");

  // if (chats.loading) {
  //   return (
  //     <div className="w-full h-48 flex justify-center items-center">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (
      chats.conversations &&
      chats.conversations.length > 0 &&
      !defaultConversationSet.current
    ) {
      setSelectedConversation(chats.conversations[0]);
      defaultConversationSet.current = true;
    }
  }, [chats.conversations]);

  const filteredConversations = chats.conversations.filter((conversation) => {
    return conversation.participants.some((participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col h-[calc(100vh-68px)] w-4/12 bg-gray-100 shadow-inner shadow-md">
        <h1 className="mx-4 mt-2 text-2xl font-semibold">Chats</h1>
        {/* CAN REMOVE THIS ENTIRE SEARCH SECTION IF NOT IMPLEMENTED LATER */}

        <div
          className="flex justify-centefr items-center mt-2"
          id="search-container"
        >
          <div className="w-full px-4">
            <div className="relative inset-y-3 flex ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-navy-blue focus:border-navy-blue"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <hr className="h-px mt-2 bg-gray-400 border-0 shadow"></hr>
        {/* FUNCTION: RETURN ALL OPEN CHATS FOR USER*/}
        {filteredConversations.map((chat) => (
          <div
            key={chat.conversationId}
            onClick={() => {
              setSelectedConversation(chat);
            }}
            className="group flex flex-wrap justify-between items-center px-4 py-2 lg:visible hover:bg-navy-blue/80"
          >
            <div className="flex flex-row">
              <div id="sidebarAvatar">
                <img
                  className="w-11 h-11 object-cover rounded-full"
                  src={
                    chat.participants.find(
                      (participant) =>
                        participant.id !== user?.firebaseUser.uid,
                    )?.profilePicture
                  }
                />
              </div>
              <div className="hidden md:flex flex-col w-42" id="chatPreview">
                <p className="mx-4 font-semibold text-md truncate group-hover:text-white">
                  {
                    chat.participants.find(
                      (participant) =>
                        participant.id !== user?.firebaseUser.uid,
                    )?.name
                  }
                </p>
                <div>
                  <div className="flex gap-x-2">
                    <p className="ml-4 text-sm text-gray-600 truncate group-hover:text-slate-400">
                      {chat.lastMessage}
                    </p>
                    <p className=" text-sm text-gray-600 font-semibold truncate group-hover:text-slate-400">
                      {chat.lastMessageCreatedAt &&
                        chat.lastMessageCreatedAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden group-hover:flex" id="chatCloseButton">
              <svg
                className="w-6 h-6 text-red-400 hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>
        ))}
      </div>
      {selectedConversation ? (
        <SingleChat conversation={selectedConversation} />
      ) : (
        <div className="flex justify-center items-center w-8/12 h-[calc(100vh-68px)]">
          {/* Optional: Add a spinner or a message here */}
          <p>There's nothing here yet</p>
        </div>
      )}
    </div>
  );
};
