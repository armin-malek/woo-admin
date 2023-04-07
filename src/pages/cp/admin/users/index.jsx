import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { parseDateFull } from "../../../../server/common/time";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AdminUserTableItem from "../../../../components/cp/admin/users/AdminUserTableItem";
import AdminUserEditModal from "../../../../components/cp/admin/users/AdminUserEditModal";
import AdminUserAddModal from "../../../../components/cp/admin/users/AdminUserAddModal";
import axios from "axios";
import Paginator from "../../../../components/Paginator";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeUser, setActiveUser] = useState();
  const [rerender, setRerender] = useState(false);
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);

  function handleShowEdit(order) {
    setActiveUser(order);
    setShowEditModal(true);
  }
  function handleCloseEdit() {
    setActiveUser();
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
      const { data } = await axios.get("/api/cp/admin/users/get-users", {
        params: { page: pageNum },
      });

      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }

      setUsers(data.users);
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
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
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
                    <th className="align-middle">نام</th>
                    <th className="align-middle">موبایل</th>
                    <th className="align-middle">آخرین ورود</th>
                    <th className="align-middle">ثبت نام</th>
                    <th className="align-middle">فروشگاه ها</th>
                    <th className="align-middle">سفارشات</th>
                  </tr>
                </thead>
                <tbody className="table">
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={7} />
                  ) : (
                    users.map((user, index) => (
                      <AdminUserTableItem
                        key={index}
                        user={user}
                        handleView={handleShowEdit}
                      ></AdminUserTableItem>
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

      <AdminUserEditModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        user={activeUser}
        LoadProducts={LoadProducts}
      ></AdminUserEditModal>
      <AdminUserAddModal
        show={showAddModal}
        handleClose={handleCloseAdd}
        LoadProducts={LoadProducts}
      ></AdminUserAddModal>
    </>
  );
};

Page.PageLayout = LayoutAdmin;

export default Page;
