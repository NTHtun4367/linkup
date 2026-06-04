import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSendMessageMutation } from "@/store/slices/messageApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toast } from "sonner";

function MessageInput() {
  const [text, setText] = useState("");
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser?._id) return;

    try {
      await sendMessage({
        userId: selectedUser._id,
        data: { text: text.trim() },
      }).unwrap();
      setText("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="bg-primary/15 w-full p-3 rounded-lg flex items-center gap-2"
    >
      <Input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-transparent border-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        disabled={isLoading || !text.trim()}
        size="sm"
        className="rounded-full"
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
}

export default MessageInput;
