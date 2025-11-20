import type { ProfileResult } from "../types";

const ProfileTab = (props: ProfileResult) => {
  // TODO: for debugging; remove this line later
  console.info(props)
  
  return (
    <div className="w-full flex flex-col">
      {/* TODO: Implement the profile tab */}
      <p>프로필 탭(프로필 있는 경우)</p>
    </div>
  );
};

export default ProfileTab;
