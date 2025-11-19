import { useGetChatPartnersQuery } from "@/store/slices/messageApi";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UserIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "@/store/slices/chat";

function ChatList() {
  const { data: chats = [], isLoading } = useGetChatPartnersQuery(undefined);
  const dispatch = useDispatch();

  if (isLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-primary/5 hover:bg-primary/25 transition-colors px-4 py-2 mb-2 rounded-lg cursor-pointer"
          onClick={() => dispatch(setSelectedUser(chat))}
        >
          <div className="flex items-center gap-2">
            <UserIcon className="size-11 bg-primary/15 p-2 rounded-full" />
            <p className="text-sm font-medium">{chat.name}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatList;
