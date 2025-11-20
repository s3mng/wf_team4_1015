import { useState } from 'react';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>('bookmarks');

  return (
    <div className="py-20 px-6">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 탭 메뉴 */}
      <div className="flex gap-4 border-b border-gray-300 mb-6">
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


      

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'bookmarks' && (
          <div>
            <p>관심공고 내용</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            <p>내 정보 내용</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;