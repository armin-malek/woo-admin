import LayoutSeller from "../../../../components/LayoutSeller";
import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import { toast } from "react-toastify";
import { parseDate, parseDateFull } from "../../../../server/common/time";
import SellerOrderTableItem from "../../../../components/cp/seller/orders/SellerOrderTableItem";
import SellerOrderViewModal from "../../../../components/cp/seller/orders/SellerOrderViewModal";
import SellerOrderEditModal from "../../../../components/cp/seller/orders/SellerOrderEditModal";
import Paginator from "../../../../components/Paginator";
import axios from "axios";

const SellerOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState();
  const [activeEditOrder, setActiveEditOrder] = useState();
  const [rerender, setRerender] = useState(false);
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);

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
  }, [rerender, pageNum]);

  async function LoadOrders() {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/cp/seller/orders/get-orders", {
        params: { page: pageNum },
      });

      if (data.status == false) {
        toast(response.msg, { type: "error" });
        return;
      }

      data.orders.map((order) => {
        order.date = parseDate(order.date);
        order.deliveredDate = parseDateFull(order.deliveredDate);
      });
      setOrders(data.orders);
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
          <div className="card">
            <div className="table-responsive">
              <table
                className="table text-center"
                style={{ whiteSpace: "nowrap" }}
              >
                <thead className="thead-light">
                  <tr className="align-items-center">
                    <th className="align-middle">مشاهده</th>
                    <th className="align-middle">شناسه</th>
                    <th className="align-middle">خریدار</th>
                    <th className="align-middle">تاریخ</th>
                    <th className="align-middle">وضعیت</th>
                    <th className="align-middle">مبلغ</th>
                  </tr>
                </thead>
                <tbody className={styles.customtable}>
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={6} />
                  ) : (
                    orders?.map((order, index) => (
                      <SellerOrderTableItem
                        key={index}
                        order={order}
                        handleView={handleShowRecipe}
                        handleShowEdit={handleShowEdit}
                      ></SellerOrderTableItem>
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

      <SellerOrderViewModal
        show={showRecipeModal}
        handleClose={handleCloseRecipe}
        order={activeOrder}
      ></SellerOrderViewModal>
      <SellerOrderEditModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        order={activeEditOrder}
        setRerender={setRerender}
        rerender={rerender}
      ></SellerOrderEditModal>
    </>
  );
};

SellerOrders.PageLayout = LayoutSeller;

export default SellerOrders;
