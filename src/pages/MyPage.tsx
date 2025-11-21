import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookmarks, getProfile } from '../api';
import BookmarkTab from '../tabs/BookmarkTab'
import NoBookmarkTab from '../tabs/NoBookmarkTab';
import NoProfileTab from '../tabs/NoProfileTab';
import ProfileTab from '../tabs/ProfileTab'
import type { GetPostsResult, ProfileResult } from '../types';

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
  explanation: `- 게임 업계에서 4년 동안 게임 기획자로서 활동했습니다.
  - 비즈니스 로직에 대해 고민하고, 재사용성을 높이기 위한 방법을 연구합니다.
  - React, TypeScript, Next.js, React Native 환경에서 개발을 진행했습니다.
  - Redux Toolkit, zustand, Jotai 등 다양한 상태 관리를 다룬 경험이 있습니다.
  - JIRA, Trello, Figma, Slack, Notion 등을 이용한 커뮤니케이션이 가능합니다.
  - Sentry 등의 에러 트래킹 시스템을 이용해 크로스 브라우징 이슈를 해결한 경험이 있습니다.
  - Firebase를 이용한 BaaS 환경에서 개인 프로젝트를 개발한 경험이 있습니다.`,
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
  const [bookmarks, setBookmarks] = useState<GetPostsResult | null>(null);
  const [profile, setProfile] = useState<ProfileResult | null>(null);

  // NOTE: '/make-profile' page doesn't exist yet
  const handleMakeProfile = () => {
    navigate('/make-profile');
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error("Token does not exist!")
      }

      try {
        const result = await getBookmarks(token);
        setBookmarks(result);
      } catch (_) {
        setBookmarks(null);
      }
    };

    fetchBookmarks();
  }, []);

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
          (bookmarks && bookmarks.posts)
          ? <BookmarkTab {...bookmarks} />
          : <NoBookmarkTab />
        )}

        {activeTab === 'profile' && (
          profile
          ? <ProfileTab {...profile} />
          : <NoProfileTab />
        )}
      </div>
    </div>
  );
};

export default MyPage;
