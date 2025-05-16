import Main from "../Atoms/PaginatorMain";
import Warper from "../Molecules/PaginatorWarper";

export default function Paginator({ totalPage, page, action }: { totalPage: number, page: number, action: (page:number) => void }) {
  return (
    <Main>
      <Warper totalPage={totalPage} page={page} onEachSide={3} action={action} />
    </Main>
  );
}
