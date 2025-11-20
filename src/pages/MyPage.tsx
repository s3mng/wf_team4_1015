import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookmarkTab from '../tabs/BookmarkTab'
import NoProfileTab from '../tabs/NoProfileTab';
import ProfileTab from '../tabs/ProfileTab'
import type { ProfileResult } from '../types';

// TODO: Uncomment these lines later
// import Cookies from 'js-cookie';
// import { getProfile } from '../api';

const dummyProfile: ProfileResult = {
  id: "string",
  name: "string",
  createdAt: "2025-11-20T19:46:43.605Z",
  updatedAt: "2025-11-20T19:46:43.605Z",
  userRole: "APPLICANT",
  email: "test@snu.ac.kr",
  enrollYear: 2023,
  department: "언어학과,컴퓨터공학부,음악학과",
  positions: [
    "string"
  ],
  slogan: "string",
  explanation: "string",
  stacks: [
    "string"
  ],
  imageKey: "string",
  cvKey: "string",
  portfolioKey: "string",
  links: [
    {
      description: "string",
      link: "string"
    }
  ]
}

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>('bookmarks');
  const [profile, setProfile] = useState<ProfileResult | null>(null);

  // NOTE: '/make-profile' page doesn't exist yet
  const handleMakeProfile = () => {
    navigate('/make-profile');
  }

  // TODO: Uncomment the lines below after the profile feature implemented
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const token = Cookies.get('token');
  //     if (!token) {
  //       throw new Error("Token does not exist!")
  //     }

  //     try {
  //       const result = await getProfile(token);
  //       setProfile(result);
  //     } catch (_) {
  //       setProfile(null);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  // TODO: fetch dummy data; remove this later
  useEffect(() => {
    setProfile(dummyProfile);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[698px] flex-col gap-10 px-6 py-[50px]">
      <h1 className="text-3xl font-bold">마이페이지</h1>

      <div className="flex h-10 justify-between place-content-center">

        {/* Tab list */}
        <div className="flex gap-10">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`transition-colors text-lg ${
              activeTab === 'bookmarks'
                ? 'pb-0.5 border-b-2 border-black text-black font-bold'
                : 'pb-1 font-medium'
            }`}
          >
            관심공고
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`transition-colors text-lg ${
              activeTab === 'profile'
                ? 'pb-0.5 border-b-2 border-black text-black font-bold'
                : 'pb-1 font-medium'
            }`}
          >
            내 정보
          </button>
        </div>

        {/* Profile make button */}
        {activeTab === 'profile' && !profile && (
          <button
            onClick={handleMakeProfile}
            className="px-4 py-2 bg-[#e8ebef] text-black text-md rounded-lg hover:bg-gray-300"
          >
            내 프로필 생성
          </button>
        )}
      </div>

      {/* Tab contents */}
      <div>
        {activeTab === 'bookmarks' && (
          <BookmarkTab />
        )}

        {activeTab === 'profile' && profile && (
          <ProfileTab {...profile} />
        )}

        {activeTab === 'profile' && !profile && (
          <NoProfileTab />
        )}
      </div>
    </div>
  );
};

export default MyPage;
