import { useGetMessagesByUserIdQuery, useReactToMessageMutation } from "@/store/slices/messageApi";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import { CheckCheck, Smile, Paperclip, Plus } from "lucide-react";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉"];

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function groupReactions(reactions: Array<{ emoji: string; userId: string }>) {
  const grouped: Record<string, Array<string>> = {};
  reactions.forEach((r) => {
    if (!grouped[r.emoji]) grouped[r.emoji] = [];
    grouped[r.emoji].push(r.userId);
  });
  return grouped;
}

function ChatContainer() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(null);
  const [reactToMessage] = useReactToMessageMutation();

  const { data: messages = [], isLoading } = useGetMessagesByUserIdQuery(
    selectedUser?._id as string
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleReact = async (messageId: string, emoji: string) => {
    try {
      await reactToMessage({ messageId, emoji }).unwrap();
      setReactingToMessageId(null);
    } catch (error) {
      console.error("Failed to react:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 px-2 space-y-4"
      >
        {messages.length > 0 && !isLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => {
              const isSentByMe = msg.senderId === userInfo?._id;
              const groupedReactions = groupReactions(msg.reactions || []);
              const hasReactions = Object.keys(groupedReactions).length > 0;

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${
                    isSentByMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`relative max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      isSentByMe
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
                    {msg.file && (
                      <a
                        href={msg.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/20 dark:bg-black/20 p-2 rounded-lg mb-2 hover:bg-white/30 dark:hover:bg-black/30"
                      >
                        <Paperclip className="w-5 h-5" />
                        <span className="text-sm">{msg.file.name}</span>
                      </a>
                    )}
                    {msg.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${
                        isSentByMe
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span className="text-[10px]">
                        {msg.createdAt ? formatTime(msg.createdAt) : ""}
                      </span>
                      {isSentByMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                      )}
                    </div>
                  </div>

                  {/* Reaction bar */}
                  <div className="flex items-center gap-1 mt-1">
                    {hasReactions && (
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        {Object.entries(groupedReactions).map(
                          ([emoji, userIds]) => (
                            <span
                              key={emoji}
                              className="flex items-center gap-0.5"
                            >
                              <span className="text-sm">{emoji}</span>
                              {userIds.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                  {userIds.length}
                                </span>
                              )}
                            </span>
                          )
                        )}
                      </div>
                    )}
                    <button
                      onClick={() =>
                        setReactingToMessageId(
                          reactingToMessageId === msg._id ? null : msg._id
                        )
                      }
                      className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {reactingToMessageId === msg._id ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Smile className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Reaction picker */}
                  {reactingToMessageId === msg._id && (
                    <div className="flex gap-1 bg-white dark:bg-slate-700 p-1 rounded-full shadow-lg border border-border mt-1">
                      {REACTION_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(msg._id, emoji)}
                          className="text-xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
