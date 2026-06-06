import { useGetChatPartnersQuery } from "@/store/slices/messageApi";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UserIcon, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "@/store/slices/chat";
import type { RootState } from "@/store";

function ChatList() {
  const { data: chats = [], isLoading } = useGetChatPartnersQuery(undefined);
  const dispatch = useDispatch();
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );

  if (isLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-2 max-h-[420px] overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
            selectedUser?._id === chat._id
              ? "bg-primary/20 border border-primary/30"
              : "bg-primary/5 hover:bg-primary/15"
          }`}
          onClick={() => dispatch(setSelectedUser(chat))}
        >
          <div className="relative flex-shrink-0">
            {chat.profile_image?.url ? (
              <img
                src={chat.profile_image.url}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              Tap to view messages
            </p>
          </div>
          <MessageCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}

export default ChatList;
