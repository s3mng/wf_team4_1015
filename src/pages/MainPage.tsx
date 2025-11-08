import { useState } from "react"
import PostCard from "../components/PostCard";
import type { GetPostsResult, Post } from "../types";

const dummyPost: Post = {
  id: "string",
  companyName: "레브잇",
  employmentEndDate: "2025-11-07T07:16:10.893Z",
  positionTitle: "React Frontend Developer",
  domain: "EDUCATION",
  slogan: "최신 LLM 오픈 소스 모델과 자체개발 멀티모달 AI를 이용하여 초콜릿 쿠키 업계를 혁신합니다. 최신 LLM 오픈 소스 모델과 자체개발 멀티모달 AI를 이용하여 초콜릿 쿠키 업계를 ...",
  headCount: 0,
  isBookmarked: true
}

const dummyResult: GetPostsResult = {
  posts: Array.from({length: 12}, () => dummyPost),
  paginator: {
    lastPage: 2
  }
}

const MainPage = () => {
  const [page, setPages] = useState(1);

  // const [res, setRes] = useState<Post[] | null>(null);
  const posts: Post[] = dummyResult.posts;
  const numPages = dummyResult.paginator.lastPage;

  return (
    <div className="py-20 flex justify-center-safe">
      <div className="flex flex-col gap-6">
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post: Post) => (
            <PostCard {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
