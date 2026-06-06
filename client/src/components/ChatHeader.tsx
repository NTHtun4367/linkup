import type { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { UserIcon, X, Phone, Video, MoreVertical } from "lucide-react";
import { setSelectedUser } from "@/store/slices/chat";

function ChatHeader() {
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center bg-primary/5 dark:bg-slate-800/50 p-4 rounded-xl border border-border/50 mb-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          {selectedUser?.profile_image?.url ? (
            <img
              src={selectedUser.profile_image.url}
              alt={selectedUser.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-3 border-white dark:border-slate-900"></div>
        </div>

        <div>
          <h3 className="font-bold text-lg">{selectedUser?.name}</h3>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Video className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          onClick={() => dispatch(setSelectedUser(null))}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;
