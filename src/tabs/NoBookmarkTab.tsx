import { useNavigate } from 'react-router-dom';

const NoBookmarkTab = () => {
  const navigate = useNavigate();

  // NOTE: '/make-profile' page doesn't exist yet
  const handleMakeProfile = () => {
    navigate('/');
  };

  return (
    <div className="px-4 py-8 flex flex-col gap-6 place-content-center">
      <h2 className="text-center text-2xl font-bold">
        아직 담아둔 관심공고가 없어요!
      </h2>
      <p className="text-center text-md font-medium text-[#5f656f]">
        관심 있는 인턴 공고를 찾아 담아 보세요.
      </p>
      <button
        onClick={handleMakeProfile}
        className="py-2 bg-[#383b41] text-[#e8ebef] text-md font-bold rounded-lg hover:bg-gray-300"
      >
        지금 바로 공고 보러 가기
      </button>
    </div>
  );
};

export default NoBookmarkTab;
