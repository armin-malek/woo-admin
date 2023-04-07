import CartProduct from "../../../../components/shop/cart/CartProduct";
import { useState, useContext } from "react";
import { CartContext } from "../../../../context/CartContex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import LayoutShop from "../../../../components/LayoutShop";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../../../../server/common/get-server-auth-session";
import { prisma } from "../../../../server/db/client";
import CartAddressSelect from "../../../../components/shop/cart/CartAddressSelect";

export default function ShopCart({ Addresses }) {
  const cart = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("Online");
  const [selectedAddress, setSelectedAddress] = useState();
  const router = useRouter();
  const { marketID } = router.query;

  function handleOrderSubmit() {
    async function submitOrder() {
      try {
        setIsSubmitting(true);
        let products = [];
        cart
          .getItems(marketID)
          .map((item) =>
            products.push({ id: item.id, quantity: item.quantity })
          );

        let fetchResp = await fetch("/api/shop/submit-order", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            products,
            paymentMethode: selectedPayment,
            marketID,
            AddressID: selectedAddress,
          }),
        });
        let response = await fetchResp.json();
        setIsSubmitting(false);
        if (response.status == false) {
          toast("خطایی در ثبت سفارش رخ داد!", { type: "error" });
          return;
        }
        cart.removeAll();
        if (response.redirect) {
          window.location = response.redirect;
          return;
        }
        toast(response.msg, { type: "success" });
      } catch (err) {
        console.log("err", err);
        setIsSubmitting(false);
        toast("خطایی در ثبت سفارش رخ داد!", { type: "error" });
      }
    }
    submitOrder();
  }

  return (
    <>
      <LayoutShop>
        <div className="subtitle h6">
          <div className="d-inline-block">
            سبد خرید من
            <br />
            <p className="small text-mute">
              {cart.getItems(marketID).length} مورد
            </p>
          </div>
        </div>
        <div className="d-flex">
          <div className="col-12 px-0">
            <ul className="list-group list-group-flush mb-4 pr-0">
              {cart.getItems(marketID).length > 0 ? (
                cart
                  .getItems(marketID)
                  .map((item, index) => (
                    <CartProduct marketProduct={item} key={index}></CartProduct>
                  ))
              ) : (
                <div className="alert alert-info text-center" role="alert">
                  سبد خرید شما خالی است، از صفحه فروشگاه می توانید محصولات خود
                  را به سبد اضافه کنید{" "}
                </div>
              )}
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mt-1">
          <br />
          <div className="row card-body justify-content-center pt-0">
            <CartAddressSelect
              initialAddresses={Addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            ></CartAddressSelect>
          </div>
          <div className="row card-body justify-content-center py-0">
            <div className="col-auto">
              <div className="form-group">
                <label for="exampleFormControlSelect1"> طریقه پرداخت:</label>
                <select
                  className="form-control"
                  onChange={(e) => setSelectedPayment(e.target.value)}
                >
                  <option value="Online" selected>
                    آنلاین
                  </option>
                  <option value="Offline">نقدی</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-body text-center pt-0">
            <div className="row justify-content-center">
              <div className="col-auto">
                <p className="text-secondary my-1">مبلغ قابل پرداخت</p>
                <span className="mb-0" style={{ fontSize: "20px" }}>
                  {parseInt(cart.getTotalCost()).toLocaleString()} تومان
                </span>
              </div>
            </div>
            <br />
            <div className="row justify-content-center">
              <div className="col-11 col-sm-9 col-md-6 col-lg-5">
                <button
                  className="btn btn-lg btn-default text-white btn-block btn-rounded shadow"
                  disabled={
                    isSubmitting
                      ? true
                      : typeof selectedAddress == "undefined"
                      ? true
                      : cart.getItems(marketID).length > 0
                      ? false
                      : true
                  }
                  onClick={handleOrderSubmit}
                >
                  {isSubmitting ? (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span>ثبت فاکتور</span>
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="pr-1"
                      ></FontAwesomeIcon>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </LayoutShop>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerAuthSession(context);
  const Addresses = await prisma.customerAddress.findMany({
    where: { Customer: { User: { id: session.user.id } } },
    orderBy: { DateCreated: "asc" },
  });

  Addresses.map((item) => {
    item.DateCreated = `${item.DateCreated}`;
  });

  //console.log("Addresses", Addresses);
  return {
    props: { Addresses },
  };
}
