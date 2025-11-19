import { useCurrentUserQuery } from "@/store/slices/userApi";
import { ModeToggle } from "./ModeToggle";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { UserIcon } from "lucide-react";

function ProfileHeader() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { data: currentUser, isError } = useCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError || !userInfo) {
      navigate("/");
    }
  }, [isError, userInfo]);

  return (
    <div className="flex items-center justify-between">
      {currentUser && (
        <div className="w-52 h-16 flex items-center gap-2">
          <div>
            {currentUser.profile_image.length > 0 ? (
              <img
                src={currentUser.profile_image[0].url}
                alt={currentUser.profile_image[0].public_alt}
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
      <ModeToggle />
    </div>
  );
}

export default ProfileHeader;
