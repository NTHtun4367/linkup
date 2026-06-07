import type { User } from "@/types/user";
import { apiSlice } from "./api";
import type { Message } from "@/types/message";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllContacts: builder.query<User[], void>({
      query: () => "messages/contacts",
      providesTags: ["Messages"],
    }),
    getChatPartners: builder.query<User[], void>({
      query: () => "messages/chats",
      providesTags: ["Messages"],
    }),
    getMessagesByUserId: builder.query<Message[], string>({
      query: (userId) => `messages/${userId}`,
      providesTags: ["Messages"],
    }),
    sendMessage: builder.mutation({
      query: ({ userId, data }) => ({
        url: `messages/send/${userId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Messages"],
    }),
    reactToMessage: builder.mutation({
      query: ({ messageId, emoji }) => ({
        url: `messages/react/${messageId}`,
        method: "POST",
        body: { emoji },
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useGetChatPartnersQuery,
  useGetMessagesByUserIdQuery,
  useSendMessageMutation,
  useReactToMessageMutation,
} = messageApiSlice;
