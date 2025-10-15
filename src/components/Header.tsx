import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full justify-center bg-grey-50 shadow-md">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:w-screen-sm md:w-screen-md lg:w-screen-lg xl:max-w-screen-xl">
        <Link to="/">
          <h1 className="hover:text-blue-normal cursor-pointer text-xl font-bold text-gray-800 transition-colors duration-150">
            인턴하샤
          </h1>
        </Link>
        <div className="items-center gap-5 xs:flex">
          <button className="inline-flex justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-grey-500 hover:bg-grey-200 h-[42px] items-center px-4 py-2">
            <Link to="/sign-up">회원가입</Link>
          </button>
          <button className="inline-flex justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-grey-500 hover:bg-grey-200 h-[42px] items-center px-4 py-2">
            <Link to="/sign-in">로그인</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
