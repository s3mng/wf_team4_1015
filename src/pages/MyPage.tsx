import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookmarkTab from '../tabs/BookmarkTab'
import ProfileTab from '../tabs/ProfileTab'
import type { ProfileResult } from '../types';

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>('bookmarks');

  // NOTE: '/make-profile' page doesn't exist yet
  const handleMakeProfile = () => {
    navigate('/make-profile');
  }
  
  // TODO: replace with the real profile data
  const existsProfile = false;
  const profileResult: ProfileResult = {
    id: "string",
    name: "string",
    createdAt: "2025-11-20T19:46:43.605Z",
    updatedAt: "2025-11-20T19:46:43.605Z",
    userRole: "APPLICANT",
    email: "string",
    enrollYear: 0,
    department: "string",
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

  return (
    <div className="mx-auto flex w-full max-w-[698px] flex-col gap-10 px-6 py-[50px]">
      <h1 className="text-2xl font-bold">마이페이지</h1>

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
        {activeTab === 'profile' && !existsProfile && (
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
        {activeTab === 'profile' && (
          <ProfileTab {...profileResult} />
        )}
      </div>
    </div>
  );
};

export default MyPage;
