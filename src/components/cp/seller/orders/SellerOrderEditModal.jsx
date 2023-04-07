import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import OrderEditProduct from "./OrderEditProduct";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function SellerOrderEditModal({
  show,
  handleClose,
  order,
  rerender,
  setRerender,
}) {
  const [orderData, setOrderData] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState();
  /*
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
    CalcNewAmount();
  }, [orderData]);
  */

  useEffect(() => {
    setOrderData(order);
    setTotalAmount(order?.amount);
  }, [order]);

  function submitComplete(newStatus) {
    async function submit(newStatus) {
      try {
        const dialogResult = await Swal.fire({
          title: "توجه!",
          text: "پس از نهایی شدن، فاکتور قابل ویرایش نخواهد بود!",
          customClass: "font-fa",
          //icon: "warning",
          showDenyButton: true,
          confirmButtonText: "تایید",
          denyButtonText: "لغو",
          color: "red",
          reverseButtons: false,
        });

        if (!dialogResult.isConfirmed) {
          handleClose();
          return;
        }
        /*
        let items = orderData?.items?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        }));
        if (!orderData || orderData.items.length < 1) {
          toast("نمی توان تغییرات را ذخیره کرد!", { type: "error" });
          return;
        }
        */
        const fetchResp = await fetch("/api/cp/seller/orders/change", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderData.id,
            status: newStatus,
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
    submit(newStatus);
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
          {" "}
          <i className="fa fa-close close" data-dismiss="modal" />{" "}
        </div>
        <div className="row ">
          <div className="col-12 px-4">
            <div className="d-flex justify-content-between mt-1">
              <span> تاریخ سفارش: {order?.date} </span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>آقا / خانم: {orderData?.Customer?.User?.fullName}</span>
            </div>
            <div className="d-flex mt-1">
              تلفن:
              <a
                className="px-1"
                href={`tel:${orderData?.Customer?.User?.mobile}`}
              >
                {orderData?.Customer?.User?.mobile}
              </a>
            </div>

            <div className="table-responsive mt-2">
              <div className="table-responsive mt-2">
                <table
                  className="table text-center font-medium-1"
                  style={{ minWidth: "max-content" }}
                >
                  <thead>
                    <tr>
                      <th scope="col">ردیف</th>
                      <th scope="col">محصول</th>
                      <th scope="col">تعداد</th>
                      <th scope="col">مبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.items?.map((item, index) => (
                      <tr key={index} className="border-bottom">
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {parseInt(
                            item.price * item.quantity
                          ).toLocaleString()}{" "}
                          تومان
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span className="font-weight-bold">
                مجموع: {Math.round(totalAmount).toLocaleString()} تومان
              </span>
            </div>
            <div className="row justify-content-center mt-2">
              <button
                className="btn btn-success ml-1"
                onClick={() => submitComplete("PreparedByMarket")}
              >
                آماده ارسال
              </button>
              <button
                className="btn btn-danger ml-1"
                onClick={() => submitComplete("Canceled")}
              >
                رد سفارش
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
