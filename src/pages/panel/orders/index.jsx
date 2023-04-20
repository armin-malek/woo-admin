import TableRowSkeleton from "../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import LayoutAdmin from "../../../components/LayoutAdmin";
import Paginator from "../../../components/Paginator";
import axios from "axios";
import OrderTableItem from "../../../components/panel/orders/OrderTableItem";
import OrderEditModal from "../../../components/panel/orders/OrderEditModal";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState();
  const [activeEditOrder, setActiveEditOrder] = useState();
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("any");

  function handleShowRecipe(order) {
    setActiveOrder(order);
    setShowRecipeModal(true);
  }
  function handleCloseRecipe() {
    setActiveOrder();
    setShowRecipeModal(false);
  }
  function handleShowEdit(order) {
    setActiveEditOrder(order);
    setShowEditModal(true);
  }
  function handleCloseEdit() {
    setActiveEditOrder();
    setShowEditModal(false);
  }

  useEffect(() => {
    LoadOrders();
  }, []);

  useEffect(() => {
    LoadOrders();
  }, [pageNum, searchStatus]);
  useEffect(() => {
    // query for data after 1500ms of of nut typeing in search field
    const delayDebounceFn = setTimeout(() => LoadOrders(), 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  async function LoadOrders() {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/panel/orders", {
        params: { page: pageNum, search: searchTerm, status: searchStatus },
      });

      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }

      setOrders(data.orders);
      setIsLoading(false);
      setPageCount(data.pages);
    } catch (err) {
      console.log(err);
      toast("خطا در بارگذاری اطلاعات", { type: "error" });
    }
  }

  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <div className="col pr-0 pt-0">
              <input
                type="text"
                className="form-control form-control-lg  d-inline"
                placeholder="جستجو ..."
                autoComplete="off"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  height: "35px",
                  borderRadius: "8px",
                  maxWidth: "250px",
                }}
              />

              <select
                className="form-control d-inline mr-1"
                style={{ maxWidth: "150px" }}
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="any">همه وضعیت ها</option>
                <option value="processing">در حال انجام</option>
                <option value="pending">در انتظار پرداخت</option>
                <option value="on-hold">در انتظار بررسی</option>
                <option value="completed">تکمیل شده</option>
                <option value="cancelled">لغو شده</option>
                <option value="refunded">مسترد شده</option>
                <option value="failed">ناموفق</option>
                <option value="checkout-draft">پیش نویس</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="table-responsive" style={{ whiteSpace: "nowrap" }}>
              <table className="table text-center">
                <thead className="thead-light">
                  <tr className="">
                    <th className="align-middle">مشاهده</th>
                    <th className="align-middle">سفارش</th>
                    <th className="align-middle">تاریخ</th>
                    <th className="align-middle">وضعیت</th>
                    <th className="align-middle">مبلغ</th>
                  </tr>
                </thead>
                <tbody className="table">
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={5} />
                  ) : (
                    orders?.map((order, index) => (
                      <OrderTableItem
                        key={index}
                        order={order}
                        handleShowEdit={handleShowEdit}
                      ></OrderTableItem>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {pageCount > 1 && (
            <div className="row justify-content-center">
              <Paginator pageCount={pageCount} setPageNum={setPageNum} />
            </div>
          )}
        </div>
      </div>

      <OrderEditModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        order={activeEditOrder}
        LoadOrders={LoadOrders}
      ></OrderEditModal>
    </>
  );
};

Page.PageLayout = LayoutAdmin;

export default Page;
