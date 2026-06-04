import type { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { UserIcon, X } from "lucide-react";
import { setSelectedUser } from "@/store/slices/chat";

function ChatHeader() {
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center bg-primary/10 max-h-[100px] p-2 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <UserIcon className="size-11 bg-primary/15 p-2 rounded-full" />
        </div>

        <div>
          <h3 className="font-medium">{selectedUser?.name}</h3>
          <p className="text-primary text-xs font-medium">Online</p>
        </div>
      </div>
      <Button
        className="cursor-pointer"
        size={"sm"}
        onClick={() => dispatch(setSelectedUser(null))}
      >
        <X />
      </Button>
    </div>
  );
}

export default ChatHeader;
