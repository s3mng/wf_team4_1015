import { useEffect, useState } from 'react';
import { getPosts } from '../api';
import PostCard from '../components/PostCard';
import type { Post } from '../types';

const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getPosts();
        setPosts(result.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  return (
    <div className="py-20 flex justify-center">
      <div className="flex flex-col gap-6">
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post: Post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
