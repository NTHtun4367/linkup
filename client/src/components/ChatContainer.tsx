import { useGetMessagesByUserIdQuery } from "@/store/slices/messageApi";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import { useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

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

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 px-2 space-y-4"
      >
        {messages.length > 0 && !isLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
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
                  className={`relative max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.senderId === userInfo?._id
                      ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-tr-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-xl mb-2 max-h-64 w-full object-cover"
                    />
                  )}
                  {msg.text && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  )}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 ${
                      msg.senderId === userInfo?._id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-[10px]">
                      {msg.createdAt ? formatTime(msg.createdAt) : ""}
                    </span>
                    {msg.senderId === userInfo?._id && (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
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
      <div className="pt-2">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer;
