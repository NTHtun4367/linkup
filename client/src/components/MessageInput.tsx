import { useState, useRef } from "react";
import { Send, Image, Smile, Paperclip, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSendMessageMutation } from "@/store/slices/messageApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toast } from "sonner";

const EMOJIS = ["😊", "👍", "❤️", "🎉", "😂", "😮", "😢", "🔥"];

function MessageInput() {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    base64: string;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    base64: string;
  } | null>(null);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setSelectedImage({ file, base64 });
      setSelectedFile(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setSelectedFile({ file, base64 });
      setSelectedImage(null);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser?._id) return;
    if (!text.trim() && !selectedImage && !selectedFile) return;

    try {
      const data: any = {};
      if (text.trim()) data.text = text.trim();
      if (selectedImage) data.image_url = selectedImage.base64;
      if (selectedFile) {
        data.file_data = selectedFile.base64;
        data.file_name = selectedFile.file.name;
        data.file_type = selectedFile.file.type;
      }

      await sendMessage({ userId: selectedUser._id, data }).unwrap();
      setText("");
      setSelectedImage(null);
      setSelectedFile(null);
      setShowEmojis(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSend}
        className="bg-slate-50 dark:bg-slate-800/50 w-full p-3 rounded-2xl flex items-center gap-2 border border-border/50"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10"
          onClick={() => imageInputRef.current?.click()}
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
          onClick={() => setShowEmojis(!showEmojis)}
        >
          <Smile className="w-5 h-5" />
        </Button>

        <Button
          type="submit"
          disabled={
            isLoading ||
            (!text.trim() && !selectedImage && !selectedFile)
          }
          size="icon"
          className="rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>

      {/* Emoji picker */}
      {showEmojis && (
        <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded-xl border border-border shadow-lg flex gap-2 flex-wrap">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-2xl hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Preview */}
      {(selectedImage || selectedFile) && (
        <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded-xl border border-border flex items-center justify-between">
          {selectedImage ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedImage.base64}
                alt="Selected"
                className="w-16 h-16 object-cover rounded"
              />
              <span className="text-sm">
                {selectedImage.file.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Paperclip className="w-8 h-8 text-primary" />
              <span className="text-sm">
                {selectedFile?.file.name}
              </span>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedImage(null);
              setSelectedFile(null);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default MessageInput;
