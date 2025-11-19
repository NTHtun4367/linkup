import type { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

function Main() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="max-w-6xl mx-auto">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default Main;
