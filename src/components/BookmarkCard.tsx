import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { addBookmark, removeBookmark } from "../api";
import type { PositionType } from "../types";

type BookmarkCardProps = {
  id: string;
  companyName: string;
  employmentEndDate: string | null;
  positionType: PositionType
}

function getDDayMessage(endDateString: string | null): string {
  if (!endDateString) return '상시모집';

  const today = new Date();
  const endDate = new Date(endDateString);

  if (today > endDate) return '마감';

  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffMs = endDate.getTime() - today.getTime();
  const msInDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round(diffMs / msInDay);

  if (diffDays === 0) return 'D-Day';
  else return `D-${diffDays}`;
}

function positionToKorean(positionType: PositionType): string {
  switch (positionType) {
    case "FRONT":
      return "프론트엔드 개발자";
    case "APP":
      return "앱 개발자";
    case "BACKEND":
      return "서버·백엔드 개발자";
    case "DATA":
      return "데이터 개발자";
    case "OTHERS":
      return "기타 개발자";
    case "DESIGN":
      return "디자이너";
    case "PLANNER":
      return "기획자";
    case "MARKETING":
      return "마케터";
    default:
      throw new Error("Unknown position type");
  }
}

function getBookmarkSource(isBookmarked: boolean): string {
  return `/bookmark_${isBookmarked ? 'on' : 'off'}.svg`
}

function getDDayColour(dDayMessage: string): string {
  return dDayMessage === '마감' ? '#ff0000' : '#2343ce';
}

const BookmarkCard = (props: BookmarkCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [bookmarkSource, setBookmarkSource] = useState("/bookmark_on.svg");
  const dDayMessage = getDDayMessage(props.employmentEndDate);

  const handleBookmarkClick = () => {
    const token = Cookies.get('token');
    if (!token)
      throw new Error("Token does not exist!");

    if (isBookmarked) {
      removeBookmark(props.id, token);
      setIsBookmarked(false);
    } else {
      addBookmark(props.id, token);
      setIsBookmarked(true);
    }
  };

  useEffect(() => {
    const newSource = getBookmarkSource(isBookmarked);
    setBookmarkSource(newSource);
  }, [isBookmarked]);

  return (
    <div
      key={`bookmark-${props.id}`}
      className="h-24 bg-white rounded-xl border border-[#e8ebef]"
    >
      <div className="flex w-full h-full px-6 py-4 items-center justify-between">
        <div className="flex place-content-start space-x-4">
          <button
            onClick={handleBookmarkClick}
            className="w-[30px] h-[30px] cursor-pointer hover:opacity-80 transition-opacity"
            aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
          >
            <img className="w-full h-full" src={bookmarkSource} alt="" />
          </button>
          <span className="py-1 text-md font-bold truncate">
            {props.companyName}
          </span>
        </div>
        <div className="flex flex-col space-y-1 items-end">
          <span className="text-md font-medium">
            {positionToKorean(props.positionType)}
          </span>
          <span className={`text-sm text-[${getDDayColour(dDayMessage)}]`}>
            {dDayMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
