// import { Button, HStack } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { FC } from "react";
import "../assets/Paginate.css";
import { useSearchParams } from "react-router-dom";

interface Pagination {
  productsPerPage: number;
  totalProducts: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: FC<Pagination> = ({
  productsPerPage,
  totalProducts,
  currentPage,
  paginate,
}) => {
  const pageCount = Math.ceil(totalProducts / productsPerPage);
  const [, setSearchParams] = useSearchParams();
  // Invoke when user click to request another page.

  return (
    <>
      <ReactPaginate
        className="paginator"
        breakLabel="..."
        nextLabel=">"
        onPageChange={(e) => {
          paginate(e.selected + 1);
          setSearchParams((prev) => {
            prev.set("page", `${e.selected + 1}`);
            return prev;
          });
        }}
        pageRangeDisplayed={5}
        forcePage={currentPage - 1}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
      />
    </>
  );
};

export default Pagination;
