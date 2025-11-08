import PostCard from "../components/PostCard";
import type { GetPostsResult, Post } from "../types";

const dummyPostsResult: GetPostsResult = {
  posts: [
    {
      id: "string",
      companyName: "string",
      employmentEndDate: "2025-11-07T07:16:10.893Z",
      positionTitle: "string",
      domain: "FINTECH",
      slogan: "string",
      headCount: 0,
      isBookmarked: true
    }
  ],
  "paginator": {
    "lastPage": 0
  }
}

const MainPage = () => {
  const dummyPost: Post = dummyPostsResult.posts[0]

  return (
    <div>
      <PostCard {...dummyPost} />
    </div>
  );
};

export default MainPage;
