import { apiSlice } from "./api";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput extends LoginInput {
  name: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data: RegisterInput) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data: LoginInput) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  userApiSlice;
