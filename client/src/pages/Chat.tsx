import ChatContainer from "@/components/ChatContainer";
import ChatList from "@/components/ChatList";
import ContactList from "@/components/ContactList";
import NoConversationPlaceholder from "@/components/NoConversationPlaceholder";
import ProfileHeader from "@/components/ProfileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/store";
import { setActiveTab } from "@/store/slices/chat";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { MessageSquare, Users } from "lucide-react";

function Chat() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const activeTag = useSelector((state: RootState) => state.chat.activeTab);
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeTagHandler = (tag: string) => {
    dispatch(setActiveTab(tag));
  };

  useEffect(() => {
    if (!userInfo) navigate("/login");
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-4 px-2">
      <div className="max-w-6xl mx-auto h-[90vh] flex items-center justify-center gap-3 p-2">
        {/* Sidebar Card */}
        <Card className="w-[400px] h-full shadow-xl shadow-slate-200/50 dark:shadow-slate-900/30 border-border/60 overflow-hidden">
          <CardContent className="p-4 h-full flex flex-col">
            <ProfileHeader />
            <div className="flex items-center gap-2 mt-4 mb-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
              <Button
                className="flex-1 cursor-pointer rounded-lg transition-all duration-200"
                variant={activeTag === "chats" ? "default" : "ghost"}
                size={"sm"}
                onClick={() => activeTagHandler("chats")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats
              </Button>
              <Button
                className="flex-1 cursor-pointer rounded-lg transition-all duration-200"
                variant={activeTag === "contacts" ? "default" : "ghost"}
                size={"sm"}
                onClick={() => activeTagHandler("contacts")}
              >
                <Users className="w-4 h-4 mr-2" />
                Contacts
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {activeTag === "chats" ? <ChatList /> : <ContactList />}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area Card */}
        <Card className="flex-1 h-full shadow-xl shadow-slate-200/50 dark:shadow-slate-900/30 border-border/60 overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Chat;
