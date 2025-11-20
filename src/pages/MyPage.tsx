import { useState } from 'react';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'profile'>('bookmarks');

  return (
    <div className="mx-auto flex w-full max-w-[698px] flex-col gap-10 px-6 py-[50px]">
      <h1 className="text-2xl font-bold">마이페이지</h1>

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

      {/* Tab contents */}
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
