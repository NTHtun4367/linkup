import type { User } from "@/types/user";
import { apiSlice } from "./api";

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
    getMessagesByUserId: builder.query({
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
