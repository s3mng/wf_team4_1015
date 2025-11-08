type PageButtonProp = {
  content: string;
  isSelected: boolean;
  onClick: () => void;
};

const PageButton = ({ content, isSelected, onClick }: PageButtonProp) => {
  return isSelected ? (
    <button className="bg-[#383b41] rounded-md w-8 h-8 text-sm text-white" onClick={onClick}>
      {content}
    </button>
  ) : (
    <button
      className="bg-white rounded-md w-8 h-8 text-sm text-black border border-[#d9d9d9]"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default PageButton;
