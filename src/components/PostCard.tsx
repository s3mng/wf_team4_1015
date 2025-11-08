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

const PostCard = (props: Post) => {
  const bookmarkStatus = props.isBookmarked ? 'on' : 'off';
  const bookmarkSource = `../../public/bookmark_${bookmarkStatus}.svg`;
  const dDayMessage = getDDayMessage(props.employmentEndDate);

  return (
    <div
      key={`card-${props.id}`}
      className="max-w-sm w-64 h-64 bg-white rounded-2xl border border-[#e8e8e8]"
    >
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            className="w-[40px] aspect-1/1 object-cover rounded-lg"
            src="../../public/sample_company.jpg"
            alt=""
          />
          <span className="text-xs">{props.companyName}</span>
        </div>
        <img className="w-[30px]" src={bookmarkSource} alt="" />
      </div>
      <div className="px-4 flex flex-col space-y-2">
        <div className="flex place-content-start">
          <span className="text-md font-bold">{props.positionTitle}</span>
        </div>
        <div className="flex place-content-start">
          <div className="flex rounded-sm bg-[#e8ebef]">
            <p className="mx-2 my-1 text-xs">{domainToKorean(props.domain)}</p>
          </div>
        </div>
        <div className="flex place-content-end">
          <span className="text-xs">{dDayMessage}</span>
        </div>
      </div>
      <div className="px-4 py-4 flex">
        <p className="text-xs leading-[1.5] font-light text-[#5f656f]">
          {props.slogan}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
