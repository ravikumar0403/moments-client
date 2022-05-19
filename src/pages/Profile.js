import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth, useProfile } from "hooks/selectors";
import { Outlet, useParams } from "react-router-dom";
import { getUserByUsername } from "redux/features/profileSlice";
import { Loader, ProfileDetails, ProfileTabs } from "components";
import { useDocumentTitle } from "hooks/useDocumentTitle";

export const Profile = () => {
  useDocumentTitle("Profile / Moments");
  const { username } = useParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { loading, userProfile } = useProfile();

  useEffect(() => {
    if (
      userProfile?.username !== username ||
      user.username === userProfile.username
    ) {
      dispatch(getUserByUsername(username));
    }
  }, [dispatch, user, userProfile, username]);

  if (loading || !userProfile)
    return (
      <div className=" mt-52 flex items-center justify-center ">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-[85vh] rounded">
      <ProfileDetails />
      <ProfileTabs />
      <Outlet />
    </div>
  );
};
