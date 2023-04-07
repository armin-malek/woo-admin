import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import OrderEditProduct from "./AdminOrderEditProduct";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function AdminOrderEditModal({
  show,
  handleClose,
  order,
  rerender,
  setRerender,
}) {
  const [orderData, setOrderData] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderStatus, setOrderStatus] = useState("");

  function HandleEdit(id, value) {
    orderData?.items?.map((item, index) => {
      if (item.id == id) {
        let tmp = orderData;
        tmp.items[index].quantity = value;
        setOrderData(tmp);
        return;
      }
    });
    CalcNewAmount();
  }
  function HandleRemove(id) {
    setOrderData({
      ...orderData,
      items: orderData?.items.filter((x) => x.id != id),
    });
    CalcNewAmount();
  }

  function CalcNewAmount() {
    let newAmount = 0;
    orderData?.items?.map((item) => {
      newAmount += item.price * item.quantity;
    });
    setTotalAmount(newAmount);
  }

  useEffect(() => {
    setOrderData(order);
    setTotalAmount(order?.amount);
  }, [order]);

  useEffect(() => {
    CalcNewAmount();
    if (orderData) setOrderStatus(orderData.status);
  }, [orderData]);

  function submitComplete() {
    async function submit() {
      try {
        const dialogResult = await Swal.fire({
          title: "آیا مطمئن هستید؟",
          text: "ممکن است از این فاکتور توسط مدیر قابل ویرایش نباشید؟",
          customClass: "font-fa",
          //icon: "warning",
          showDenyButton: true,
          confirmButtonText: "بله",
          denyButtonText: "خیر",
          color: "red",
        });

        if (!dialogResult.isConfirmed) {
          handleClose();
          return;
        }
        let items = orderData?.items?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        }));
        if (!orderData || orderData.items.length < 1) {
          toast("نمی توان تغییرات را ذخیره کرد!", { type: "error" });
          return;
        }
        const fetchResp = await fetch("/api/cp/admin/orders/edit-order", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderData.id,
            items,
            status: orderStatus,
          }),
        });
        const resp = await fetchResp.json();
        handleClose();
        setRerender(!rerender);
        if (resp.status != true) {
          toast(resp.msg, { type: "error" });
          return;
        }
        toast(resp.msg, { type: "success" });
      } catch (err) {
        handleClose();
        setRerender(!rerender);
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
              <span> تاریخ سفارش: {order?.date} </span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>سوپرمارکت: {orderData?.Market?.name}</span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>فروشنده: {orderData?.Market?.User?.fullName}</span>
            </div>
            <div className="d-flex mt-1">
              تلفن فروشنده:
              <a
                className="px-1"
                href={`tel:${orderData?.Market?.User?.mobile}`}
              >
                {orderData?.Market?.User?.mobile}
              </a>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>آدرس: {orderData?.Market?.marketAddress?.address}</span>
            </div>

            <div className="table-responsive mt-2">
              <table
                className="table text-center font-medium-1"
                style={{ minWidth: "max-content" }}
              >
                <thead>
                  <tr>
                    <th scope="col">حذف</th>
                    <th scope="col">محصول</th>
                    <th scope="col">مبلغ</th>
                    <th scope="col">تعداد</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.items?.map((item, index) => (
                    <OrderEditProduct
                      key={index}
                      item={item}
                      HandleEdit={HandleEdit}
                      HandleRemove={HandleRemove}
                    ></OrderEditProduct>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span className="font-weight-bold">
                مجموع: {Math.round(totalAmount).toLocaleString()} تومان
              </span>
            </div>
            <div className="row form-group px-2">
              <label>وضعیت فاکتور:</label>
              <select
                className="form-control"
                onChange={(e) => setOrderStatus(e.target.value)}
                value={orderStatus}
              >
                <option value="Completed">تکمیل</option>
                <option value="Unpaid">پرداخت نشده</option>
                <option value="WaitingMarket">در انتظار تایید فروشگاه</option>
                <option value="PreparedByMarket">در انتظار ارسال</option>
                <option value="OnDelivery">در حال ارسال</option>
                <option value="Canceled">لغو شده</option>
                <option value="Returned">برگشت خورده</option>
              </select>
            </div>

            <div className="row justify-content-center mt-1">
              <button className="btn btn-success ml-1" onClick={submitComplete}>
                ذخیره
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
