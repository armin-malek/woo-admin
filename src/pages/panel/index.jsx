import {
  faBarsStaggered,
  faCartShopping,
  faCircleCheck,
  faMoneyBillTransfer,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import LayoutAdmin from "../../components/LayoutAdmin";
import SellerWithdrawWidget from "../../components/panel/SellerWithdrawWidget";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

const Page = () => {
  const [info, setInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function LoadData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get("/api/panel");
        setIsLoading(false);
        if (data.status == false) {
          toast(data.msg, { type: "error" });
          return;
        }
        setInfo(data);
      } catch (err) {
        console.log(err);
        toast("خطایی رخ داد", { type: "error" });
      }
    }
    LoadData();
  }, []);
  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <div className="card mt-1">
            <div className="row mt-3 justify-content-start px-3">
              <SellerWithdrawWidget
                theme="green"
                icon={faCircleCheck}
                title="سفارشات  تکمیل"
                //text="5000"
                text={
                  info?.products ? (
                    info?.completedOrders
                  ) : (
                    <Skeleton width={160} />
                  )
                }
              />
              <SellerWithdrawWidget
                theme="orange"
                icon={faCartShopping}
                title="سفارشات جدید"
                text={
                  info?.products ? (
                    info?.inProgressOrders
                  ) : (
                    <Skeleton width={160} />
                  )
                }
              />
              <SellerWithdrawWidget
                theme="blue"
                icon={faBarsStaggered}
                title="کل محصولات"
                text={
                  info?.products ? info?.products : <Skeleton width={160} />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// orderCount, activeOrders, orderTotal, productCount;

Page.PageLayout = LayoutAdmin;
export default Page;
