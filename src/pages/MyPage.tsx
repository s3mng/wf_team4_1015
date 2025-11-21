import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookmarks, getApplicantProfile } from '../api';
import BookmarkTab from '../tabs/BookmarkTab'
import NoBookmarkTab from '../tabs/NoBookmarkTab';
import NoProfileTab from '../tabs/NoProfileTab';
import ProfileTab from '../tabs/ProfileTab'
import type { ApplicantProfile, GetPostsResult } from '../types';

const MyPage = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<GetPostsResult | null>(null);
  const [profileStatus, setProfileStatus] = useState<'loading' | 'exists' | 'not_found'>('loading');
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);

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


  useEffect(() => {
    if (activeTab === 'profile') {
      const fetchProfile = async () => {
        const token = Cookies.get('token');
        if (!token) {
          setProfileStatus('not_found');
          return;
        }

        try {
          const profileData = await getApplicantProfile(token);
          setProfile(profileData);
          setProfileStatus('exists');
        } catch (error) {
          const err = error as { code?: string };
          if (err.code === 'APPLICANT_002') {
            setProfileStatus('not_found');
          } else {
            console.error('Failed to fetch profile:', error);
            setProfileStatus('not_found');
          }
        }
      };

      fetchProfile();
    }
  }, [activeTab]);

  const handleCreateProfile = () => {
    if (profileStatus === 'exists') {
      navigate('/profile/create?mode=edit');
    } else {
      navigate('/profile/create');
    }
  };

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

        {/* Profile make/edit button */}
        {activeTab === 'profile' && profileStatus !== 'loading' && (
          <button
            onClick={handleCreateProfile}
            className="px-4 py-2 bg-[#e8ebef] text-black text-md rounded-lg hover:bg-gray-300"
          >
            {profileStatus === 'not_found'
              ? '내 프로필 생성'
              : '내 프로필 수정'}
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

        {activeTab === 'profile' && profileStatus === 'loading' && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        )}

        {activeTab === 'profile' && profileStatus === 'exists' && profile && (
          <ProfileTab {...profile} />
        )}

        {activeTab === 'profile' && profileStatus === 'not_found' && (
          <NoProfileTab />
        )}
      </div>
    </div>
  );
};

export default MyPage;
