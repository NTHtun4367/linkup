import { useGetMessagesByUserIdQuery } from "@/store/slices/messageApi";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import { useEffect, useRef } from "react";

function ChatContainer() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useGetMessagesByUserIdQuery(
    selectedUser?._id as string
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-8">
        {messages.length > 0 && !isLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === userInfo?._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[70%] rounded-lg p-2 ${
                    msg.senderId === userInfo?._id
                      ? "bg-primary/75 text-white dark:bg-primary/85"
                      : "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="text-xs">{msg.text}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.name!} />
        )}
      </div>

      {/* Sticks at bottom */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
