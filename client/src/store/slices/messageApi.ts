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
  }),
});

export const {
  useGetAllContactsQuery,
  useGetChatPartnersQuery,
  useGetMessagesByUserIdQuery,
  useSendMessageMutation,
} = messageApiSlice;
