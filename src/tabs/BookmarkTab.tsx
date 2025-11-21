import BookmarkCard from "../components/BookmarkCard";
import type { GetPostsResult } from "../types";

const BookmarkTab = (props: GetPostsResult) => {
  return (
    <div className="py-2 flex flex-col space-y-4">
      {props.posts.map((post) => (
        <BookmarkCard
          id={post.id}
          companyName={post.companyName}
          employmentEndDate={post.employmentEndDate}
          positionType={post.positionType}
        />
      ))}
    </div>
  );
};

export default BookmarkTab;
