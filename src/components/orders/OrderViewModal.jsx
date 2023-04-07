import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import { orderStatusFa } from "../../server/common/functions";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderViewModal({ show, handleClose, order }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="py-0">
        <div className="row w-100 justify-content-start ">
          <button
            className="btn"
            style={{ margin: "5px 5px 0px 0px" }}
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
      </Modal.Header>
      <Modal.Body dir="rtl" className=" font-fa">
        <div className="text-right">
          <i className="fa fa-close close" data-dismiss="modal" />
        </div>
        <div className="row ">
          <div className="col-12 px-4">
            <div className="row justify-content-center">
              <Image
                src={order?.Market?.logo}
                alt="logo"
                width={50}
                height={50}
              ></Image>
            </div>
            <div className="row justify-content-center">
              <h4 className="mt-3 theme-color mb-4">
                خرید از {order?.Market?.name}
              </h4>
            </div>
            <div className="row pr-4">
              <div className="col-auto">
                <span>تاریخ سفارش: </span>
                <span dir="ltr">{order?.date}</span>
              </div>
              {order?.deliveredDate && (
                <div className="col-auto">
                  <span>تاریخ تحویل: </span>
                  <span dir="ltr">{order?.date}</span>
                </div>
              )}
              <div className="col-auto">
                <span>وضعیت: </span>
                <OrderStatusBadge status={order?.status} />
              </div>

              <div className="table-responsive mt-1">
                <table
                  className="table text-center font-medium-1"
                  style={{ minWidth: "450px" }}
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
              <div className="d-flex justify-content-between mt-1">
                <span className="font-weight-bold">
                  مجموع: {parseInt(order?.amount).toLocaleString()} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
