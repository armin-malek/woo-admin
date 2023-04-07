import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { parseDateFull } from "../../../../server/common/time";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import AdminMarketTableItem from "../../../../components/cp/admin/markets/AdminMarketTableItem";
import AdminMarketEditModal from "../../../../components/cp/admin/markets/AdminMarketEditModal";
import AdminMarketAddModal from "../../../../components/cp/admin/markets/AdminMarketAddModal";
import Paginator from "../../../../components/Paginator";
import axios from "axios";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [activeItem, setActiveItem] = useState();
  const [provinces, setProvinces] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);

  function handleShowEdit(order) {
    setActiveItem(order);
    setShowEditModal(true);
  }
  function handleCloseEdit() {
    setActiveItem();
    setShowEditModal(false);
  }
  function handleShowAdd() {
    setShowAddModal(true);
  }
  function handleCloseAdd() {
    setShowAddModal(false);
  }

  useEffect(() => {
    LoadProducts();
  }, []);
  useEffect(() => {
    LoadProducts();
  }, [rerender, pageNum]);

  function doRerender() {
    setRerender(!rerender);
  }

  async function LoadProducts() {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/cp/admin/markets/get-markets", {
        params: { page: pageNum },
      });

      if (data.status != true) {
        toast(response.msg, { type: "error" });
        return;
      }

      data.markets?.map((market) => {
        market.dateRegister = parseDateFull(market.dateRegister);
      });
      setMarkets(data.markets);
      setProvinces(data.provinces);
      setPageNum(data.pagination.pageNumber);
      setPageCount(data.pagination.pageCount);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast("خطا در بارگذاری اطلاعات", { type: "error" });
    }
  }
  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <button
            className="btn btn-primary"
            style={{ borderRadius: "25px" }}
            onClick={handleShowAdd}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ height: "20px" }}
            ></FontAwesomeIcon>
            <span className="pr-1"> افزودن</span>
          </button>
          <div className="card mt-1">
            <div className="table-responsive">
              <table
                className="table text-center"
                style={{ whiteSpace: "nowrap" }}
              >
                <thead className="thead-light">
                  <tr className="">
                    <th className="align-middle">مشاهده</th>
                    <th className="align-middle">نام فروشگاه</th>
                    <th className="align-middle">نام شخص</th>
                    <th className="align-middle">موبایل</th>
                    <th className="align-middle">آدرس</th>
                    <th className="align-middle">فروش</th>
                    <th className="align-middle">مشتری</th>
                    <th className="align-middle">محصول</th>
                  </tr>
                </thead>
                <tbody className="table">
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={8} />
                  ) : (
                    markets.map((market, index) => (
                      <AdminMarketTableItem
                        key={index}
                        market={market}
                        handleView={handleShowEdit}
                      ></AdminMarketTableItem>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {pageCount > 1 && (
              <div className="row justify-content-center">
                <Paginator pageCount={pageCount} setPageNum={setPageNum} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminMarketEditModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        market={activeItem}
        provinces={provinces}
        doRerender={doRerender}
      ></AdminMarketEditModal>
      <AdminMarketAddModal
        show={showAddModal}
        handleClose={handleCloseAdd}
        provinces={provinces}
        doRerender={doRerender}
      ></AdminMarketAddModal>
    </>
  );
};

Page.PageLayout = LayoutAdmin;

export default Page;
