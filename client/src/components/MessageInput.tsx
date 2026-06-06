import { useState } from "react";
import { Send, Image, Smile, Paperclip } from "lucide-react";
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
      className="bg-slate-50 dark:bg-slate-800/50 w-full p-3 rounded-2xl flex items-center gap-2 border border-border/50"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-primary/10"
      >
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-primary/10"
      >
        <Image className="w-5 h-5" />
      </Button>
      <Input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-transparent border-none focus-visible:ring-0 text-base"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-primary/10"
      >
        <Smile className="w-5 h-5" />
      </Button>
      <Button
        type="submit"
        disabled={isLoading || !text.trim()}
        size="icon"
        className="rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}

export default MessageInput;
