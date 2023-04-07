import ReactPaginate from "react-paginate";
// import { useState } from "react";

export default function Paginator({
  pageRangeDisplayed = 5,
  pageCount,
  setPageNum,
}) {
  /*
  const [items, setItems] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  ]);

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  */
  const handlePageClick = (event) => {
    // const newOffset = (event.selected * itemsPerPage) % items.length;
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset}`
    // );
    // setItemOffset(newOffset);
    setPageNum(event.selected + 1);
  };

  return (
    <>
      <nav>
        <ReactPaginate
          breakLabel="..."
          nextLabel="<<"
          previousLabel=">>"
          onPageChange={handlePageClick}
          pageRangeDisplayed={pageRangeDisplayed}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="pagination modal-2"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          nextClassName="page-item"
          previousClassName="page-item"
          breakClassName="page-item"
        />
      </nav>
      <style>{`
        .pagination {
            list-style: none;
            display: inline-block;
            padding: 0;
            margin-top: 10px;
          }
          .pagination li {
            display: inline;
            text-align: center;
          }
          .pagination a {
            float: left;
            display: block;
            font-size: 14px;
            text-decoration: none;
            padding: 5px 12px;
            color: #fff;
            margin-left: -1px;
            border: 1px solid transparent;
            line-height: 1.5;
          }
          .pagination a.active {
            cursor: default;
          }
          .pagination a:active {
            outline: none;
          }
          
          .modal-2 li:first-child a {
            -webkit-border-radius: 50px 0 0 50px;
            -moz-border-radius: 50px 0 0 50px;
            -ms-border-radius: 50px 0 0 50px;
            -o-border-radius: 50px 0 0 50px;
            border-radius: 50px 0 0 50px;
          }
          .modal-2 li:last-child a {
            -webkit-border-radius: 0 50px 50px 0;
            -moz-border-radius: 0 50px 50px 0;
            -ms-border-radius: 0 50px 50px 0;
            -o-border-radius: 0 50px 50px 0;
            border-radius: 0 50px 50px 0;
          }
          .modal-2 a {
            border-color: #ddd;
            color: #999;
            background: #fff;
          }
          .modal-2 a:hover {
            color: #E34E48;
            background-color: #eee;
          }
          .modal-2 a.active, .modal-2 a:active {
            border-color: #E34E48;
            background: #E34E48;
            color: #fff;
          }
          .page-item.selected > a {
            background-color: #E34E48;
            color:#fff;
          }
          .page-item.disabled > a {
            background-color: #dbdbdb;
            color:#fff;
            cursor:inherit;
          }
          .page-item:focus, .page-item > a:focus {
            box-shadow:none;
          }
      `}</style>
    </>
  );
}
