import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { parseDate, parseDateFull } from "../../../../server/common/time";
import AdminOrderTableItem from "../../../../components/cp/admin/orders/AdminOrderTableItem";
import AdminOrderViewModal from "../../../../components/cp/admin/orders/AdminOrderViewModal";
import AdminOrderEditModal from "../../../../components/cp/admin/orders/AdminOrderEditModal";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import Paginator from "../../../../components/Paginator";
import axios from "axios";

const AdminOrders = () => {
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
      const { data } = await axios.get("/api/cp/admin/orders/get-orders", {
        params: { page: pageNum },
      });

      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }

      data.orders?.map((order) => {
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
            <div className="table-responsive" style={{ whiteSpace: "nowrap" }}>
              <table className="table text-center">
                <thead className="thead-light">
                  <tr className="">
                    <th className="align-middle">مشاهده</th>
                    <th className="align-middle">کد</th>
                    <th className="align-middle">خریدار</th>
                    <th className="align-middle">فروشگاه</th>
                    <th className="align-middle">تاریخ تحویل</th>
                    <th className="align-middle">وضعیت</th>
                    <th className="align-middle">طریقه پرداخت</th>
                    <th className="align-middle">مبلغ</th>
                    <th className="align-middle">نمایش مسیر</th>
                  </tr>
                </thead>
                <tbody className="table">
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={9} />
                  ) : (
                    orders?.map((order, index) => (
                      <AdminOrderTableItem
                        key={index}
                        order={order}
                        handleView={handleShowRecipe}
                        handleShowEdit={handleShowEdit}
                      ></AdminOrderTableItem>
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

      <AdminOrderViewModal
        show={showRecipeModal}
        handleClose={handleCloseRecipe}
        order={activeOrder}
      ></AdminOrderViewModal>
      <AdminOrderEditModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        order={activeEditOrder}
        setRerender={setRerender}
        rerender={rerender}
      ></AdminOrderEditModal>
    </>
  );
};

AdminOrders.PageLayout = LayoutAdmin;

export default AdminOrders;
