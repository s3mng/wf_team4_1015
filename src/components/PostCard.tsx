import { domainToKorean } from '../domain';
import type { Post } from '../types';

function getDDayMessage(endDateString: string): string {
  const today = new Date();
  const endDate = new Date(endDateString);

  if (today > endDate) return '마감';

  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffMs = endDate.getTime() - today.getTime();
  const msInDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round(diffMs / msInDay);

  if (diffDays === 0) return '오늘 마감!';
  else return `마감 D-${diffDays}`;
}

type PostCardProps = Post & {
  onBookmarkToggle: (postId: string, currentState: boolean) => void;
};

const PostCard = (props: PostCardProps) => {
  const bookmarkStatus = props.isBookmarked ? 'on' : 'off';
  const bookmarkSource = `/bookmark_${bookmarkStatus}.svg`;
  const dDayMessage = getDDayMessage(props.employmentEndDate);

  const handleBookmarkClick = () => {
    props.onBookmarkToggle(props.id, props.isBookmarked);
  };

  return (
    <div
      key={`card-${props.id}`}
      className="max-w-sm w-64 h-64 bg-white rounded-2xl border border-[#e8e8e8]"
    >
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            className="w-[40px] aspect-1/1 object-cover rounded-lg"
            src="/sample_company.jpg"
            alt=""
          />
          <span className="text-xs">{props.companyName}</span>
        </div>
        <button
          onClick={handleBookmarkClick}
          className="w-[30px] h-[30px] cursor-pointer hover:opacity-80 transition-opacity"
          aria-label={props.isBookmarked ? '북마크 해제' : '북마크 추가'}
        >
          <img className="w-full h-full" src={bookmarkSource} alt="" />
        </button>
      </div>
      <div className="px-4 flex flex-col space-y-2">
        <div className="flex place-content-start">
          <span className="text-md font-bold truncate">{props.positionTitle}</span>
        </div>
        <div className="flex place-content-start">
          <p className="text-xs leading-[1.5] font-light text-[#5f656f] line-clamp-2">
            {props.slogan}
          </p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex rounded-sm bg-[#e8ebef]">
            <p className="mx-2 my-1 text-xs">{domainToKorean(props.domain)}</p>
          </div>
          <span className="text-xs">{dDayMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
