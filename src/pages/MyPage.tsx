import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicantProfile } from '../api';
import type { ApplicantProfile } from '../types';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>(
    'bookmarks'
  );
  const [profileStatus, setProfileStatus] = useState<
    'loading' | 'exists' | 'not_found'
  >('loading');
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const navigate = useNavigate();

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
    <div className="py-20 px-6">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 탭 메뉴 */}
      <div className="flex justify-between items-center border-b border-gray-300 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-2 px-4 transition-colors ${
              activeTab === 'bookmarks'
                ? 'border-b-2 border-black text-black font-bold'
                : 'text-gray-500 hover:text-gray-700 font-normal'
            }`}
          >
            관심공고
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-4 transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-black text-black font-bold'
                : 'text-gray-500 hover:text-gray-700 font-normal'
            }`}
          >
            내 정보
          </button>
        </div>

        {activeTab === 'profile' && (
          <button
            onClick={handleCreateProfile}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
          >
            {profileStatus === 'not_found'
              ? '내 프로필 생성'
              : '내 프로필 수정'}
          </button>
        )}
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'bookmarks' && (
          <div>
            <p>관심공고 내용</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            {profileStatus === 'loading' && (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            )}

            {profileStatus === 'not_found' && (
              <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-bold mb-6">
                  아직 프로필이 등록되지 않았어요!
                </h2>
                <p className="text-gray-600 mb-8">
                  기업에 소개할 나의 정보를 작성해서 나를 소개해보세요.
                </p>
                <button
                  onClick={handleCreateProfile}
                  className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  지금 바로 프로필 작성하기
                </button>
              </div>
            )}

            {profileStatus === 'exists' && profile && (
              <div className="max-w-2xl">
                <div className="py-8">
                  {/* 이름 */}
                  <h2 className="text-3xl font-bold mb-6">{profile.name}</h2>

                  {/* 이메일 */}
                  <div className="text-gray-700 mb-2">{profile.email}</div>

                  {/* 학과 정보 */}
                  {profile.department && (
                    <div className="text-gray-600">
                      {profile.department.split(',').join(' · ')}{' '}
                      {profile.enrollYear && `${profile.enrollYear}학번`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
