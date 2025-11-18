import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { store } from "./store/index.ts";
import Main from "./layouts/Main.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      // {
      //   index: true,
      //   element: <Chat />,
      // },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
