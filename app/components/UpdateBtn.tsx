import React from "react";

type Props = {
  text: string;
  onbtnclick: () => void;
};

const UpdateBtn = ({ text, onbtnclick }: Props) => {
  return (
    <button
      onClick={onbtnclick}
      className="text-sm py-[4px] px-10 border-[3px] border-[#193b69] rounded-sm cursor-pointer hover:bg-[#063862] shadow-custom-inset"
    >
      {text}
    </button>
  );
};

export default UpdateBtn;
