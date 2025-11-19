import { setActiveTab } from "@/store/slices/chat";
import { MessageCircleIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";

function NoChatsFound() {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h4 className="font-medium mb-1">No conversations yet</h4>
        <p className="text-slate-400 text-sm px-6">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <Button
        className="cursor-pointer"
        size={"sm"}
        onClick={() => dispatch(setActiveTab("contacts"))}
      >
        Find contacts
      </Button>
    </div>
  );
}

export default NoChatsFound;
