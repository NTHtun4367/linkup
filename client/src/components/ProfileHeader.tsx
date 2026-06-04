import { useCurrentUserQuery, useLogoutMutation } from "@/store/slices/userApi";
import { ModeToggle } from "./ModeToggle";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { UserIcon, LogOut } from "lucide-react";
import { clearUserInfo } from "@/store/slices/auth";
import { Button } from "./ui/button";
import { toast } from "sonner";

function ProfileHeader() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { data: currentUser, isError } = useCurrentUserQuery();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError || !userInfo) {
      navigate("/login");
    }
  }, [isError, userInfo, navigate]);

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(clearUserInfo());
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-between">
      {currentUser && (
        <div className="w-52 h-16 flex items-center gap-2">
          <div>
            {currentUser.profile_image?.url ? (
              <img
                src={currentUser.profile_image.url}
                alt={currentUser.profile_image.public_alt}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="size-11 bg-primary/15 p-2 rounded-full" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-primary font-medium">Online</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default ProfileHeader;
