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
    <div className="max-w-6xl h-[650px] flex items-center justify-center gap-2 bg-primary/15 p-2 my-4 rounded-2xl">
      <Card className="w-[500px] h-full">
        <CardContent>
          <ProfileHeader />
          <div className="flex items-center gap-2 mt-4 border-t border-t-primary/15 pt-4">
            <Button
              className="flex-1 cursor-pointer"
              variant={activeTag === "chats" ? "default" : "secondary"}
              size={"sm"}
              onClick={() => activeTagHandler("chats")}
            >
              Chats
            </Button>
            <Button
              className="flex-1 cursor-pointer"
              variant={activeTag === "contacts" ? "default" : "secondary"}
              size={"sm"}
              onClick={() => activeTagHandler("contacts")}
            >
              Contacts
            </Button>
          </div>
          <div className="mt-4 border-t border-t-primary/15 pt-4">
            {activeTag === "chats" ? <ChatList /> : <ContactList />}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full">
        <CardContent>
          <div>
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Chat;
