import LayoutSeller from "../../../../components/LayoutSeller";
import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SellerCustomerTableItem from "../../../../components/cp/seller/customers/SellerCustomerTableItem";
import SellerCustomerModal from "../../../../components/cp/seller/customers/SellerCustomerModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Paginator from "../../../../components/Paginator";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState();
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);

  function handleShowModal(order) {
    setActiveCustomer(order);
    setShowModal(true);
  }
  function handleCloseModal() {
    setActiveCustomer();
    setShowModal(false);
  }

  useEffect(() => {
    LoadCustomers();
  }, []);
  useEffect(() => {
    LoadCustomers();
  }, [pageNum]);

  async function LoadCustomers() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "/api/cp/seller/customers/get-customers",
        { params: { page: pageNum } }
      );

      if (data.status == false) {
        toast(data.msg, { type: "error" });
        return;
      }

      setCustomers(data.customers);
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
          {/* 
          <button
            className="btn btn-primary mb-2"
            style={{ borderRadius: "25px" }}
            onClick={handleShowModal}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ height: "20px" }}
            ></FontAwesomeIcon>
            <span className="pr-1"> افزودن</span>
          </button>*/}

          <div className="card">
            <div className="table-responsive">
              <table
                className="table text-center"
                style={{ whiteSpace: "nowrap" }}
              >
                <thead className="thead-light">
                  <tr className="align-items-center">
                    <th className="align-middle">نام</th>
                    <th className="align-middle">موبایل</th>
                    <th className="align-middle">تاریخ ایجاد</th>
                    <th className="align-middle">وضعیت</th>
                    <th className="align-middle">تعداد سفارش</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={5} />
                  ) : (
                    customers?.map((customer, index) => (
                      <SellerCustomerTableItem
                        key={index}
                        customer={customer}
                      ></SellerCustomerTableItem>
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

      <SellerCustomerModal
        show={showModal}
        handleClose={handleCloseModal}
        customer={activeCustomer}
        LoadCustomers={LoadCustomers}
      ></SellerCustomerModal>
    </>
  );
};

Page.PageLayout = LayoutSeller;

export default Page;
