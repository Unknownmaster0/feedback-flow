"use client";

export default function ButtonComponent({
  text,
  onClickHandler,
}: {
  text: string;
  onClickHandler: () => void;
}) {
  return (
    <button
      className={`bg-[#52656d] font-semibold lg:font-bold py-1 px-2 md:px-5 lg:py-2 lg:px-10 rounded-lg lg:rounded-xl text-[#f1f7fb]`}
      onClick={onClickHandler}
    >
      {text}
    </button>
  );
}
