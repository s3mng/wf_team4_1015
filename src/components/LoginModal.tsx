import { useNavigate } from 'react-router-dom';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate('/sign-in');
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-md text-[#383b41] font-bold mb-4">
            찜하기를 하려면 로그인이 필요해요
          </h2>
          <p className="text-sm text-[#383b41] mb-8 leading-[1.5]">
            계정이 없으시다면 <br></br> 지금 바로 회원가입해보세요
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-[#484c53] text-white text-xs font-semibold rounded-lg hover:bg-gray-800"
          >
            로그인하기
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#f1f2f5] text-[#777f8b] text-xs font-semibold rounded-lg hover:bg-gray-300"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
