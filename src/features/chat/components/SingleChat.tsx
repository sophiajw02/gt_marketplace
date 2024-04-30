import { useAuth } from "@/hooks";
import { postChat, useMessages } from "../api";
import { Spinner } from "@/components/Elements";
import type { Message, Conversation } from "../types";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const SingleChat = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { user } = useAuth();
  const sender = conversation.participants.find(
    (participant) => participant.id !== user?.firebaseUser.uid,
  );
  const navigate = useNavigate();

  const messages = useMessages(user?.firebaseUser.uid, sender?.id);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.messages]);

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      postChat(
        conversation.conversationId,
        user?.firebaseUser.uid,
        inputValue.trim(),
      );
      setInputValue("");
    }
  };

  // Function to handle key down events for submission and new lines
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid line break on enter
      handleSubmit();
    }
  };

  if (messages.loading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-10/12 ">
      {/* TODO: Add search bar */}
      <div
        className="flex flex-row items-center bg-navy-blue h-16"
        id="chatHeader"
      >
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={() => navigate(`/profile/${sender?.id}`)}
        >
          <div className="mx-4 my-4" id="chatAvatar">
            <img
              className="w-12 h-12 object-cover object-center rounded-full"
              src={sender?.profilePicture ?? ""}
            />
          </div>
          <h1 className="mr-4 my-4 text-2xl text-white font-semibold">
            {sender?.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap " id="chatContainer">
        <div
          className="flex flex-col h-[calc(100vh-231px)] px-10 pt-5 w-full overflow-y-auto"
          id="chatContent"
        >
          <div className="flex flex-col gap-5">
            {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image"/> */}
            <div className="flex flex-col gap-5">
              {messages.messages.map((message: Message, index) =>
                message.sender === user?.firebaseUser.uid ? (
                  // Message sent by the user
                  <div
                    className="flex justify-end"
                    ref={
                      index === messages.messages.length - 1
                        ? lastMessageRef
                        : null
                    }
                    key={message.id}
                  >
                    <div
                      className="flex flex-col max-w-[420px] leading-1.5 p-4 border-gray-200 bg-navy-blue/90 rounded-l-xl rounded-br-xl"
                      id="messageContainerSent"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-normal text-white"
                          id="messageTime"
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hourCycle: "h23",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                        </span>
                      </div>
                      <p
                        className="text-sm font-normal py-2.5 text-white"
                        id="messageContent"
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Message received by the user
                  <div
                    className="flex justify-start"
                    ref={
                      index === messages.messages.length - 1
                        ? lastMessageRef
                        : null
                    }
                    key={message.createdAt.toString()}
                  >
                    <div
                      className="flex flex-col max-w-[420px] leading-1.5 p-4 border-gray-200 bg-tech-gold rounded-e-xl rounded-es-xl"
                      id="messageContainerReceived"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-normal text-white"
                          id="messageTime"
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hourCycle: "h23",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                        </span>
                      </div>
                      <p
                        className="text-sm font-normal py-2.5 text-white"
                        id="messageContent"
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky w-full">
        <div className="border-t flex bg-gray-50 p-4">
          <textarea
            id="user-input"
            placeholder="Send a message"
            className="resize-none w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-navy-blue"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            id="send-button"
            className="flex flex-row items-center w-24 bg-navy-blue text-white px-4 py-2 rounded-r-md hover:bg-navy-blue/80 transition duration-300"
            onClick={handleSubmit}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <p className="font-semibold ml-2">Send</p>
          </button>
        </div>
      </div>
    </div>
  );
};
