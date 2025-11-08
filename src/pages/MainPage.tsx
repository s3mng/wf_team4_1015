import { useState } from 'react';
import PageButton from '../components/PageButton';
import PostCard from '../components/PostCard';
import type { GetPostsResult, Post } from '../types';

const dummyPost: Post = {
  id: 'string',
  companyName: '레브잇',
  employmentEndDate: '2025-11-07T07:16:10.893Z',
  positionTitle: 'React Frontend Developer',
  domain: 'EDUCATION',
  slogan:
    '최신 LLM 오픈 소스 모델과 자체개발 멀티모달 AI를 이용하여 초콜릿 쿠키 업계를 혁신합니다. 최신 LLM 오픈 소스 모델과 자체개발 멀티모달 AI를 이용하여 초콜릿 쿠키 업계를 ...',
  headCount: 0,
  isBookmarked: true,
};

const dummyResult: GetPostsResult = {
  posts: Array.from({ length: 12 }, () => dummyPost),
  paginator: {
    lastPage: 2,
  },
};

const MainPage = () => {
  // TODO: Remove hard-wired initializer
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<GetPostsResult | null>(dummyResult);

  // TODO: Uncomment this after `getPosts` implemented
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await getPosts(page);
  //     setRes(res);
  //   };

  //   fetchData();
  // }, [page]);

  const posts = res?.posts ?? [];
  const numPages = res?.paginator.lastPage ?? 1;

  return (
    <div className="py-20 flex justify-center-safe">
      <div className="flex flex-col gap-6">
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post: Post) => (
            <PostCard {...post} />
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <PageButton
            content="<"
            isSelected={false}
            onClick={() => setPage(page === 1 ? 1 : page - 1)}
          />
          {[...Array(numPages)].map((_, i) => (
            <PageButton
              content={String(i + 1)}
              isSelected={i + 1 === page}
              onClick={() => setPage(i + 1)}
            />
          ))}
          <PageButton
            content=">"
            isSelected={false}
            onClick={() => setPage(page === numPages ? numPages : page + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
