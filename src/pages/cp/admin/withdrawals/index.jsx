import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import AdminUserEditModal from "../../../../components/cp/admin/users/AdminUserEditModal";
import AdminUserAddModal from "../../../../components/cp/admin/users/AdminUserAddModal";
import axios from "axios";
import AdminWithdrawTableItem from "../../../../components/cp/admin/withdrawals/AdminWhitdrawTableItem";
import AdminWithdrawEditModal from "../../../../components/cp/admin/withdrawals/AdminWithdrawEditModal";
import Paginator from "../../../../components/Paginator";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeItem, setActiveItem] = useState();
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
    Loadwithdrawals();
  }, []);
  useEffect(() => {
    Loadwithdrawals();
  }, [pageNum]);

  async function Loadwithdrawals() {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/cp/admin/withdrawals/get", {
        params: { page: pageNum },
      });

      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }

      setWithdrawals(data.withdraws);
      setPageNum(data.pagination.pageNumber);
      setPageCount(data.pagination.pageCount);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast("خطا در بارگذاری اطلاعات", { type: "error" });
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <div className="card mt-1">
            <div className="table-responsive">
              <table
                className="table text-center"
                style={{ whiteSpace: "nowrap" }}
              >
                <thead className="thead-light">
                  <tr className="">
                    <th className="align-middle">مشاهده</th>
                    <th className="align-middle">شناسه</th>
                    <th className="align-middle">شخص</th>
                    <th className="align-middle">فروشگاه</th>
                    <th className="align-middle">مبلغ</th>
                    <th className="align-middle">وضعیت</th>
                    <th className="align-middle">شماره تراکنش</th>
                    <th className="align-middle">تاریخ درخواست</th>
                    <th className="align-middle">تاریخ تکمیل</th>
                  </tr>
                </thead>
                <tbody className="table">
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={9} />
                  ) : (
                    withdrawals.map((withdraw, index) => (
                      <AdminWithdrawTableItem
                        key={index}
                        withdraw={withdraw}
                        handleView={handleShowEdit}
                      ></AdminWithdrawTableItem>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {pageCount > 0 && (
              <div className="row justify-content-center">
                <Paginator pageCount={pageCount} setPageNum={setPageNum} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminWithdrawEditModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        withdrawID={activeItem?.id}
        Loadwithdrawals={Loadwithdrawals}
      ></AdminWithdrawEditModal>
      <AdminUserAddModal
        show={showAddModal}
        handleClose={handleCloseAdd}
      ></AdminUserAddModal>
    </>
  );
};

Page.PageLayout = LayoutAdmin;

export default Page;
