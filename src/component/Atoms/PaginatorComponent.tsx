"use client";
import { useContext } from "react";
import { PaginatorContext } from "./PaginatorMain";
type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;

function CloseToEnd({ action }: { action: (page:number) => void }) {
  const { totalPage, currentPage, onEachSide } = useContext(PaginatorContext);

  const array = Array.from(
    { length: onEachSide * 2 + 4 },
    (_, index) => index + (totalPage - (onEachSide * 2 + 4)) + 1,
  );
  return (
    <>
      {array.map((page) => (
        <button
          key={page}
          onClick={() => action(page)}
          disabled={currentPage == page}
          className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
        >
          {page}
        </button>
      ))}
    </>
  );
}
function CloseToStart({ action }: { action: (page:number) => void }) {
  const { currentPage, onEachSide } = useContext(PaginatorContext);
  const array = Array.from(
    { length: onEachSide * 2 + 4 },
    (_, index) => index + 1,
  );
  return (
    <>
      {array.map((page) => (
        <button
          key={page}
          onClick={() => action(page)}
          disabled={currentPage == page}
          className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
        >
          {page}
        </button>
      ))}
    </>
  );
}
function End({ action }: { action: (page:number) => void }) {
  const { totalPage } = useContext(PaginatorContext);
  return (
    <>
      <button
        disabled={true}
        className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
      >
        ...
      </button>
      <button
        onClick={() => action(totalPage - 1)}
        className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
      >
        {totalPage - 1}
      </button>
      <button
        onClick={() => action(totalPage)}
        className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
      >
        {totalPage}
      </button>
    </>
  );
}
const MainElement = ({
  className,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex ${className}`}
    >
      {children}
    </button>
  );
};
function Main({ action }: { action: (page:number) => void }) {
  const { currentPage, onEachSide } = useContext(PaginatorContext);
  const first = Array.from(
    { length: onEachSide },
    (_, index) => index + (currentPage - onEachSide),
  );
  const last = Array.from(
    { length: onEachSide },
    (_, index) => index + (currentPage + 1),
  );
  return (
    <>
      {first.map((page) => (
        <MainElement
          key={page}
          onClick={() => action(page)}
          className={`${currentPage == page ? "disabled" : ""}`}
        >
          {page}
        </MainElement>
      ))}
      <MainElement onClick={() => action(currentPage)} className="disabled">{currentPage}</MainElement>
      {last.map((page) => (
        <MainElement
          key={page}
          onClick={() => action(page)}
          className={`${currentPage == page ? "disabled" : ""}`}
        >
          {page}
        </MainElement>
      ))}
    </>
  );
}
function Next({ action }: { action: (page:number) => void }) {
  const { totalPage, currentPage } = useContext(PaginatorContext);
  return (
    <button
      onClick={() => action(currentPage + 1)}
      disabled={currentPage == totalPage}
      className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px inline-flex cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed"
    >
      <svg className="h-full w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
function Previous({ action }: { action: (page:number) => void }) {
  const { currentPage } = useContext(PaginatorContext);
  return (
    <button
      onClick={() => action(currentPage - 1)}
      disabled={currentPage == 1}
      className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px inline-flex cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed"
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
function Small({ action }: { action: (page:number) => void }) {
  const { totalPage, currentPage } = useContext(PaginatorContext);
  const array = Array.from({ length: totalPage }, (_, index) => index + 1);
  return (
    <>
      {array.map((page) => (
        <button
          key={page}
          onClick={() => action(page)}
          disabled={page == currentPage}
          className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed sm:inline-flex"
        >
          {page}
        </button>
      ))}
    </>
  );
}
function Start({ action }: { action: (page:number) => void }) {
  return (
    <>
      <button
        onClick={() => action(1)}
        className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
      >
        1
      </button>
      <button
        onClick={() => action(2)}
        className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
      >
        2
      </button>
      <button
        disabled={true}
        className="border-primary-300 bg-primary-50 text-primary-900 hover:bg-primary-50 disabled:border-primary-300 disabled:bg-primary-50 disabled:text-primary-700 relative -ml-px hidden cursor-pointer items-center border px-4 py-2 text-sm leading-5 font-medium disabled:cursor-not-allowed md:inline-flex"
      >
        ...
      </button>
    </>
  );
}

export { Next, Previous, Small, Start, End, Main, CloseToEnd, CloseToStart };
