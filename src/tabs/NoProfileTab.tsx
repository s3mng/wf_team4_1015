import { useNavigate } from 'react-router-dom';

const NoProfileTab = () => {
  const navigate = useNavigate();

  // NOTE: '/make-profile' page doesn't exist yet
  const handleMakeProfile = () => {
    navigate('/make-profile');
  };

  return (
    <div className="px-4 py-8 flex flex-col gap-6 place-content-center">
      <h2 className="text-center text-2xl font-bold">
        아직 프로필이 등록되지 않았어요!
      </h2>
      <p className="text-center text-md font-medium text-[#5f656f]">
        기업에 소개할 나의 정보를 작성해서 나를 소개해보세요.
      </p>
      <button
        onClick={handleMakeProfile}
        className="py-2 bg-[#383b41] text-[#e8ebef] text-md font-bold rounded-lg hover:bg-gray-300"
      >
        지금 바로 프로필 작성하기
      </button>
    </div>
  );
};

export default NoProfileTab;
