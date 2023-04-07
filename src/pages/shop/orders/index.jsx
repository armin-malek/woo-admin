import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LayoutShop from "../../../components/LayoutShop";
import OrderItemSkeleton from "../../../components/orders/OrderItemSkeleton";
import UserOrdersProductImage from "../../../components/orders/UserOrdersProductImage";
import OrderViewModal from "../../../components/orders/OrderViewModal";
import { orderStatusFa, priceLocale } from "../../../server/common/functions";
import { parseDate, parseDateFull } from "../../../server/common/time";
import OrderTrackModal from "../../../components/orders/OrderTrackModal";
import OrderItemPayAgain from "../../../components/orders/OrderItemPayAgain";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";

const Orders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState();

  const router = useRouter();

  function handleShowRecipe(order) {
    setActiveOrder(order);
    setShowRecipeModal(true);
  }
  function handleCloseRecipe() {
    setActiveOrder();
    setShowRecipeModal(false);
  }

  function handleShowTrack(order) {
    setActiveOrder(order);
    setShowTrackModal(true);
  }
  function handleCloseTrack() {
    setActiveOrder();
    setShowTrackModal(false);
  }

  useEffect(() => {
    LoadOrders();
  }, []);

  useEffect(() => {
    // show message coming back from payment
    let { pok, pmsg } = router.query;
    if (typeof pok != "undefined" && typeof pmsg != "undefined") {
      toast(pmsg, {
        type: pok == "true" ? "success" : "error",
        delay: 10000,
      });
      router.replace("/shop/orders", undefined, { shallow: true });
    }
  }, [router.query]);

  async function LoadOrders() {
    try {
      setIsLoading(true);
      const fetchResp = await fetch(`/api/shop/orders/get-orders`);
      const response = await fetchResp.json();

      if (response.status != true) {
        toast(response.msg, { type: "error" });
        return;
      }

      response.data?.map((order) => {
        order.date = parseDateFull(order.date);
        if (order.deliveredDate)
          order.deliveredDate = parseDateFull(order.deliveredDate);
      });
      setOrders(response.data);
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
          {isLoading ? (
            <>
              {Array(8)
                .fill(0)
                .map((item, index) => (
                  <OrderItemSkeleton key={index}></OrderItemSkeleton>
                ))}
            </>
          ) : (
            <>
              {orders?.map((order, index) => (
                <div className="row mb-2 justify-content-center" key={index}>
                  <div className="col-10 col-xs-10 col-sm-9 col-md-8 col-lg-6">
                    <div className="card">
                      <div className="card-body pb-2">
                        <div className="row">
                          <div
                            className="col-6 col-xs-6 col-md-6 col-lg-6"
                            style={{ width: "100%", maxWidth: "fit-content" }}
                          >
                            <Image
                              src={order.Market.logo}
                              alt="market logo"
                              width={70}
                              height={70}
                              style={{
                                border: "1px solid rgb(237 237 237 / 15%)",
                                borderRadius: "4px",
                                boxShadow:
                                  "-3px 0 8px -8px black, 3px 0 8px -8px black",
                              }}
                            ></Image>
                          </div>
                          <div
                            className="col-6 col-xs-6 col-md-6 col-lg-6"
                            style={{
                              fontWeight: "bold",
                              padding: "10px 5px 0px 0px",
                              width: "-webkit-fill-available",
                            }}
                          >
                            <h2
                              style={{ fontSize: "15px", marginBottom: "3px" }}
                            >
                              {order.Market.name}
                            </h2>
                            <h2
                              style={{ fontSize: "12px", marginBottom: "3px" }}
                              dir="ltr"
                            >
                              {order.date}
                            </h2>
                            <h2
                              style={{
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                display: "block",
                                textOverflow: "ellipsis",
                                width: "250px",
                                maxWidth: "-webkit-fill-available",
                              }}
                            >
                              تحویل به: {order.CustomerAddress?.address}
                            </h2>
                          </div>
                        </div>
                        <div className="row mr-0 mt-2">
                          <div style={{ flexGrow: 6 }}>
                            {order?.items?.slice(0, 3).map((item, index) => (
                              <UserOrdersProductImage
                                key={index}
                                image={item.Image}
                                quantity={item.quantity}
                              />
                            ))}
                          </div>
                          <div
                            style={{
                              flexGrow: 6,
                              textAlign: "end",
                              paddingLeft: "20px",
                              display: "flex",
                              justifyContent: "center",
                              alignContent: "center",
                              flexDirection: "column",
                            }}
                          >
                            {priceLocale(order.amount)}
                          </div>
                        </div>
                        <div className="row mx-0 mt-4 justify-content-end">
                          {[
                            "WaitingMarket",
                            "PreparedByMarket",
                            "OnDelivery",
                          ].includes(order.status) && (
                            <div className="col-6">
                              <button
                                className="btn btn-success w-100"
                                onClick={() => handleShowTrack(order)}
                              >
                                پیگیری سفارش
                              </button>
                            </div>
                          )}

                          {order.status == "Unpaid" && (
                            <OrderItemPayAgain orderID={order.id} />
                          )}

                          <div className="col-6 w-100">
                            <button
                              className="btn btn-outline-secondary w-100"
                              onClick={() => handleShowRecipe(order)}
                            >
                              نمایش جزئیات
                            </button>
                          </div>
                        </div>
                        <OrderStatusBadge
                          styles={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                          }}
                          status={order?.status}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <OrderViewModal
        show={showRecipeModal}
        handleClose={handleCloseRecipe}
        order={activeOrder}
      ></OrderViewModal>
      <OrderTrackModal
        show={showTrackModal}
        handleClose={handleCloseTrack}
        order={activeOrder}
      ></OrderTrackModal>
      <style jsx>{`
        .btn-success {
          background-color: #5d3ebd;
        }
        .btn-success:active {
          background-color: #5639ac !important;
        }
        .btn-success:active:focus {
          box-shadow: 0 0 0 0.2rem rgb(87 72 180 / 50%);
        }

        .col-6:first-child:nth-last-child(1) {
          min-width: 100%;
        }
      `}</style>
    </>
  );
};

Orders.PageLayout = LayoutShop;
export default Orders;
