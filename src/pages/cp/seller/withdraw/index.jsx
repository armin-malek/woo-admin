import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillTransfer,
  faPlus,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

import LayoutSeller from "../../../../components/LayoutSeller";
import SellerWithdrawWidget from "../../../../components/cp/seller/withdrawals/SellerWithdrawWidget";
import { priceLocale } from "../../../../server/common/functions";
import Skeleton from "react-loading-skeleton";
import SellerWithdrawReqModal from "../../../../components/cp/seller/withdrawals/SellerWithdrawReqModal";
import SellerwithdrawTableItem from "../../../../components/cp/seller/withdrawals/SellerWithdrawTableItem";
import Paginator from "../../../../components/Paginator";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState();
  const [frozenBalance, setFrozenBalance] = useState();
  const [showReqModal, setShowReqModal] = useState(false);
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);

  function handleShowReq() {
    setShowReqModal(true);
  }
  function handleCloseReq() {
    setShowReqModal(false);
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
      const { data } = await axios.get("/api/cp/seller/withdraw/get", {
        params: { page: pageNum },
      });

      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }

      setWithdrawals(data.marketWithdraws);
      setBalance(data.balance);
      setFrozenBalance(data.frozenBalance);
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
            <div className="row mt-3 justify-content-start px-3">
              <SellerWithdrawWidget
                theme="green"
                icon={faWallet}
                title="موجودی قابل تسویه"
                text={balance ? priceLocale(balance) : <Skeleton width={160} />}
              />
              <SellerWithdrawWidget
                theme="orange"
                icon={faMoneyBillTransfer}
                title="موجودی در حال تسویه"
                text={
                  frozenBalance ? (
                    priceLocale(frozenBalance)
                  ) : (
                    <Skeleton width={160} />
                  )
                }
              />
            </div>

            <hr style={{ marginTop: "-10px" }} />
            <div className="d-flex mx-3 mb-1" style={{ marginTop: "-8px" }}>
              <button
                className="btn btn-info"
                style={{ borderRadius: "25px" }}
                onClick={() => handleShowReq()}
              >
                <FontAwesomeIcon icon={faPlus} className="pl-1" />
                درخواست تسویه
              </button>
            </div>
            {withdrawals?.length > 0 ? (
              <>
                <div className="table-responsive">
                  <table className="table text-center">
                    <thead className="thead-light">
                      <tr className="">
                        <th className="align-middle">شناسه</th>
                        <th className="align-middle">مبلغ</th>
                        <th className="align-middle">وضعیت</th>
                        <th className="align-middle">تاریخ درخواست</th>
                        <th className="align-middle">تاریخ تکمیل</th>
                        <th className="align-middle">شماره پیگیری</th>
                      </tr>
                    </thead>
                    <tbody className="table">
                      {isLoading ? (
                        <TableRowSkeleton rows={10} cells={6} />
                      ) : (
                        <>
                          {withdrawals?.map((withdraw, index) => (
                            <SellerwithdrawTableItem
                              key={index}
                              withdraw={withdraw}
                              handleView={handleShowReq}
                            ></SellerwithdrawTableItem>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                {pageCount > 1 && (
                  <div className="row justify-content-center">
                    <Paginator pageCount={pageCount} setPageNum={setPageNum} />
                  </div>
                )}
              </>
            ) : (
              <span className="alert alert-info text-center mx-3">
                تا به حال درخواست تسویه ثبت نکرده اید.
              </span>
            )}
          </div>
        </div>
      </div>
      <SellerWithdrawReqModal
        show={showReqModal}
        Loadwithdrawals={Loadwithdrawals}
        handleClose={handleCloseReq}
        balance={balance}
      ></SellerWithdrawReqModal>
    </>
  );
};

Page.PageLayout = LayoutSeller;

export default Page;
