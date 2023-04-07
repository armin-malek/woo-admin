import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import OrderEditProduct from "./OrderEditProduct";
import { toast } from "react-toastify";
import axios from "axios";
import SpinnerCustom from "../../SpinnerCustom";

export default function OrderEditModal({
  show,
  handleClose,
  order,
  LoadOrders,
}) {
  const [orderStatus, setOrderStatus] = useState(order?.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setOrderStatus(order?.status);
  }, [order]);
  function submitChanges() {
    async function submit() {
      try {
        setIsSubmitting(true);
        const { data } = await axios.post("/api/panel/orders/update", {
          orderID: order.id,
          status: orderStatus,
        });
        if (data.status != true) {
          toast(data.msg, { type: "error" });
          return;
        }
        setIsSubmitting(false);
        handleClose();
        LoadOrders();
        toast(data.msg, { type: "success" });
      } catch (err) {
        setIsSubmitting(false);

        handleClose();
        LoadOrders();
        toast("خطایی رخ داد.", { type: "error" });
        console.log(err);
      }
    }
    submit();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body dir="rtl" className="font-fa pt-1">
        <div className="row w-100 justify-content-start ">
          <button
            className="btn"
            style={{ marginRight: "15px" }}
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ height: "20px" }}
            ></FontAwesomeIcon>
          </button>
        </div>
        <div className="text-right">
          <i className="fa fa-close close" data-dismiss="modal" />{" "}
        </div>
        <div className="row ">
          <div className="col-12 px-4">
            <div className="d-flex justify-content-between mt-1">
              <span>
                خریدار: {order?.billing?.first_name} {order?.billing?.last_name}
              </span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>موبایل: {order?.billing?.phone}</span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>ایمیل: {order?.billing?.email}</span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>
                {`آدرس: ${order?.billing?.city}، ${order?.billing?.address_1}. کدپستی: ${order?.billing?.postcode}`}
              </span>
            </div>

            <div className="table-responsive mt-2">
              <table
                className="table text-center font-medium-1"
                style={
                  {
                    //minWidth: "max-content"
                  }
                }
              >
                <thead>
                  <tr>
                    <th scope="col">تصویر</th>
                    <th scope="col">محصول</th>
                    <th scope="col">مبلغ</th>
                    <th scope="col">تعداد</th>
                    <th scope="col">مجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.line_items?.map((item, index) => (
                    <OrderEditProduct
                      key={index}
                      item={item}
                    ></OrderEditProduct>
                  ))}
                </tbody>
              </table>
            </div>

            <label>وضعیت سفارش:</label>
            <div className="row form-group px-2">
              <select
                className="form-control"
                style={{ maxWidth: "250px" }}
                onChange={(e) => setOrderStatus(e.target.value)}
                value={orderStatus}
              >
                <option value="processing">در حال انجام</option>
                <option value="pending">در انتظار پرداخت</option>
                <option value="on-hold">در انتظار بررسی</option>
                <option value="completed">تکمیل شده</option>
                <option value="cancelled">لغو شده</option>
                <option value="refunded">مسترد شده</option>
                <option value="failed">ناموفق</option>
                <option value="checkout-draft">پیش نویس</option>
              </select>
            </div>

            <div className="row justify-content-center mt-1">
              {isSubmitting ? (
                <SpinnerCustom type="primary" />
              ) : (
                <button
                  className="btn btn-success ml-1"
                  onClick={submitChanges}
                >
                  ذخیره
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
