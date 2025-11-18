import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import themeReducer from "./slices/theme";
import { apiSlice } from "./slices/api";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
