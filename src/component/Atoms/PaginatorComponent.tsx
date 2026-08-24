"use client";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

// ────────────────────────────────────────────────────────────
// TIPE SHARED
// ────────────────────────────────────────────────────────────
type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;

type PageButtonProps = {
  action: (page: number) => void;
  currentPage: number;
};

// ────────────────────────────────────────────────────────────
// ATOM SUB-KOMPONEN — SEMUA PURE / PRESENTATIONAL
// Tidak ada usePaginator() di sini. Semua data masuk via props.
// Context dependency telah dipindahkan ke Organisms/Paginator.
// ────────────────────────────────────────────────────────────

function CloseToEnd({
  action,
  currentPage,
  totalPage,
  onEachSide,
}: PageButtonProps & { totalPage: number; onEachSide: number }) {
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
          className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
        >
          {page}
        </button>
      ))}
    </>
  );
}

function CloseToStart({
  action,
  currentPage,
  onEachSide,
}: PageButtonProps & { onEachSide: number }) {
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
          className="cursor-pointer rounded-box px-2 py-1 text-sm leading-5 font-medium hover:bg-primary-400 hover:text-primary-content disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-content lg:px-4 lg:py-2"
        >
          {page}
        </button>
      ))}
    </>
  );
}

function End({
  action,
  totalPage,
}: {
  action: (page: number) => void;
  totalPage: number;
}) {
  return (
    <>
      <button
        disabled={true}
        className="px-2 py-1 text-sm leading-5 font-medium lg:px-4 lg:py-2"
      >
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

// Internal helper — tidak diekspor
const PageButton = ({
  className,
  children,
  onClick,
  currentPage,
  ...props
}: ButtonProps & { currentPage: number }) => {
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

function Main({
  action,
  currentPage,
  onEachSide,
}: PageButtonProps & { onEachSide: number }) {
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
        <PageButton key={page} onClick={() => action(page)} currentPage={currentPage}>
          {page}
        </PageButton>
      ))}
      <PageButton onClick={() => action(currentPage)} currentPage={currentPage}>
        {currentPage}
      </PageButton>
      {last.map((page) => (
        <PageButton key={page} onClick={() => action(page)} currentPage={currentPage}>
          {page}
        </PageButton>
      ))}
    </>
  );
}

function Next({
  action,
  currentPage,
  totalPage,
}: PageButtonProps & { totalPage: number }) {
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

function Previous({
  action,
  currentPage,
}: PageButtonProps) {
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

function Small({
  action,
  currentPage,
  totalPage,
}: PageButtonProps & { totalPage: number }) {
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
      <button
        disabled={true}
        className="px-2 py-1 text-sm leading-5 font-medium lg:px-4 lg:py-2"
      >
        ...
      </button>
    </>
  );
}

export { Next, Previous, Small, Start, End, Main, CloseToEnd, CloseToStart };
