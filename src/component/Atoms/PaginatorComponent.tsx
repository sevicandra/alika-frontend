"use client";
import { usePaginator } from "@/context/paginator";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;

function CloseToEnd({ action }: { action: (page: number) => void }) {
  const { totalPage, page: currentPage, onEachSide } = usePaginator();

  const array = Array.from(
    { length: onEachSide * 2 + 4 },
    (_, index) => index + (totalPage - (onEachSide * 2 + 4)) + 1
  );
  return (
    <>
      {array.map((page) => (
        <button
          key={page}
          onClick={() => action(page)}
          disabled={currentPage == page}
          className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
        >
          {page}
        </button>
      ))}
    </>
  );
}
function CloseToStart({ action }: { action: (page: number) => void }) {
  const { page: currentPage, onEachSide } = usePaginator();
  const array = Array.from({ length: onEachSide * 2 + 4 }, (_, index) => index + 1);
  return (
    <>
      {array.map((page) => (
        <button
          key={page}
          onClick={() => action(page)}
          disabled={currentPage == page}
          className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
        >
          {page}
        </button>
      ))}
    </>
  );
}
function End({ action }: { action: (page: number) => void }) {
  const { totalPage } = usePaginator();
  return (
    <>
      <button disabled={true} className="px-2 py-1 text-sm leading-5 font-medium lg:px-4 lg:py-2">
        ...
      </button>
      <button
        onClick={() => action(totalPage - 1)}
        className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
      >
        {totalPage - 1}
      </button>
      <button
        onClick={() => action(totalPage)}
        className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
      >
        {totalPage}
      </button>
    </>
  );
}
const MainElement = ({ className, children, onClick, ...props }: ButtonProps) => {
  const { page: currentPage } = usePaginator();
  return (
    <button
      onClick={onClick}
      {...props}
      disabled={currentPage == children}
      className={`cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2 ${className}`}
    >
      {children}
    </button>
  );
};
function Main({ action }: { action: (page: number) => void }) {
  const { page: currentPage, onEachSide } = usePaginator();
  const first = Array.from(
    { length: onEachSide },
    (_, index) => index + (currentPage - onEachSide)
  );
  const last = Array.from({ length: onEachSide }, (_, index) => index + (currentPage + 1));
  return (
    <>
      {first.map((page) => (
        <MainElement key={page} onClick={() => action(page)}>
          {page}
        </MainElement>
      ))}
      <MainElement onClick={() => action(currentPage)}>{currentPage}</MainElement>
      {last.map((page) => (
        <MainElement key={page} onClick={() => action(page)}>
          {page}
        </MainElement>
      ))}
    </>
  );
}
function Next({ action }: { action: (page: number) => void }) {
  const { totalPage, page: currentPage } = usePaginator();
  return (
    <button
      onClick={() => action(currentPage + 1)}
      disabled={currentPage == totalPage}
      className="inline-flex cursor-pointer rounded-box border border-base-content px-4 py-1 text-sm leading-5 font-medium text-base-content disabled:cursor-not-allowed disabled:border-base-content/20 disabled:text-base-content/20"
    >
      Next <LuChevronRight className="h-full w-5" />
    </button>
  );
}
function Previous({ action }: { action: (page: number) => void }) {
  const { page: currentPage } = usePaginator();
  return (
    <button
      onClick={() => action(currentPage - 1)}
      disabled={currentPage == 1}
      className="inline-flex cursor-pointer rounded-box border border-base-content px-4 py-1 text-sm leading-5 font-medium text-base-content disabled:cursor-not-allowed disabled:border-base-content/20 disabled:text-base-content/20"
    >
      <LuChevronLeft className="h-full w-5" /> Prev
    </button>
  );
}
function Small({ action }: { action: (page: number) => void }) {
  const { totalPage, page: currentPage } = usePaginator();
  const array = Array.from({ length: totalPage }, (_, index) => index + 1);
  return (
    <>
      {array.map((page) => (
        <button
          key={page}
          onClick={() => action(page)}
          disabled={page == currentPage}
          className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
        >
          {page}
        </button>
      ))}
    </>
  );
}
function Start({ action }: { action: (page: number) => void }) {
  return (
    <>
      <button
        onClick={() => action(1)}
        className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
      >
        1
      </button>
      <button
        onClick={() => action(2)}
        className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
      >
        2
      </button>
      <button disabled={true} className="px-2 py-1 text-sm leading-5 font-medium lg:px-4 lg:py-2">
        ...
      </button>
    </>
  );
}

export { Next, Previous, Small, Start, End, Main, CloseToEnd, CloseToStart };
