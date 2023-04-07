import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import SpinnerCustom from "../SpinnerCustom";

const OrderItemPayAgain = ({ orderID }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handlePayment() {
    try {
      setIsSubmitting(true);
      const { data } = await axios.post("/api/shop/orders/pay-again", {
        orderID: orderID,
      });
      setIsSubmitting(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      if (data.redirect) {
        window.location = data.redirect;
        return;
      }
      toast("خطایی رخ داد", { type: "error" });
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
    }
  }
  return (
    <div className="col-6">
      <button
        className="btn btn-info w-100"
        disabled={isSubmitting ? true : false}
        onClick={() => handlePayment()}
      >
        {isSubmitting ? (
          <SpinnerCustom
            type="light"
            styles={{ width: "1.5rem", height: "1.5rem" }}
          />
        ) : (
          "پرداخت"
        )}
      </button>
    </div>
  );
};

export default OrderItemPayAgain;
