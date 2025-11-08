import { useEffect, useState } from 'react';
import { addBookmark, getPosts, removeBookmark } from '../api';
import FilterBar, { type FilterState } from '../components/FilterBar';
import LoginModal from '../components/LoginModal';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import Cookies from 'js-cookie';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY_FILTERS = 'mainpage_filters';
const STORAGE_KEY_PAGE = 'mainpage_page';

const MainPage = () => {
  const { user } = useAuth();

  // localStorage에서 저장된 필터와 페이지 불러오기
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PAGE);
    return saved ? Number.parseInt(saved, 10) : 1;
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FILTERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          positions: [],
          isActive: false,
          order: 0,
          domains: [],
        };
      }
    }
    return {
      positions: [],
      isActive: false,
      order: 0,
      domains: [],
    };
  });

  // 필터와 페이지를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAGE, page.toString());
  }, [page]);

  // 로그인/로그아웃 시 1페이지로 리셋
  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 로그인 상태면 토큰 포함
        const token = Cookies.get('token');

        const result = await getPosts(
          {
            positions: filters.positions.length > 0 ? filters.positions : undefined,
            isActive: filters.isActive,
            order: filters.order,
            domains: filters.domains.length > 0 ? filters.domains : undefined,
            page: page - 1, // 서버는 0-based이므로 변환
          },
          token
        );
        setPosts(result.posts);
        setLastPage(result.paginator.lastPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filters, page]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex justify-center">
        <div className="text-red-500">에러: {error}</div>
      </div>
    );
  }

  // 최대 5개의 페이지 번호를 표시하는 로직
  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages: number[] = [];

    if (lastPage <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 5개 표시
      let start = Math.max(1, page - 2);
      const end = Math.min(lastPage, start + maxVisible - 1);

      // end가 lastPage에 가까우면 start 조정
      if (end === lastPage) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // 필터 변경 시 첫 페이지로 리셋
  };

  const handleBookmarkToggle = async (postId: string, currentState: boolean) => {
    // 로그인 체크
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      // 북마크 상태 토글
      if (currentState) {
        await removeBookmark(postId, token);
      } else {
        await addBookmark(postId, token);
      }

      // 로컬 상태 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isBookmarked: !currentState } : post
        )
      );
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  return (
    <div>
      <FilterBar filters={filters} onApply={handleApplyFilters} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <div className="py-20 flex justify-center">
        <div className="flex flex-col gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post: Post) => (
              <PostCard
                key={post.id}
                {...post}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        {lastPage > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              &lt;
            </button>
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded ${
                  page === pageNum
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              &gt;
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
