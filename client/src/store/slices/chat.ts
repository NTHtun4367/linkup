import type { User } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  allContacts: [];
  chats: [];
  messages: [];
  activeTab: "chats" | "contacts";
  selectedUser: User | null;
  // isUsersLoading: boolean,
  // isMessagesLoading: boolean
}

const initialState: ChatState = {
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setActiveTab, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
