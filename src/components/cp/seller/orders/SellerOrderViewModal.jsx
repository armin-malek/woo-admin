import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";

export default function SellerOrderViewModal({ show, handleClose, order }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="py-0">
        <div className="row w-100 justify-content-end ">
          <button
            className="btn"
            style={{ marginRight: "-20px" }}
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
      </Modal.Header>
      <Modal.Body dir="rtl" className=" font-fa">
        <div className="text-right">
          {" "}
          <i className="fa fa-close close" data-dismiss="modal" />{" "}
        </div>
        <div className="row ">
          <div className="col-12 px-4">
            <div className="d-flex justify-content-between mt-1">
              <span> تاریخ سفارش: {order?.date} </span>
            </div>
            <div className="d-flex mt-1">
              تاریخ تحویل پخش:
              <span dir="ltr" className="px-1">
                {order?.deliveredDate}
              </span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>سوپرمارکت: {order?.Market?.name}</span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>آقا / خانم: {order?.Market?.User?.fullName}</span>
            </div>
            <div className="d-flex mt-1">
              تلفن:
              <a className="px-1" href={`tel:${order?.Market?.User?.mobile}`}>
                {order?.Market?.User?.mobile}
              </a>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>آدرس: {order?.Market?.marketAddress?.address}</span>
            </div>
            <div className="table-responsive mt-2">
              <table className="table text-center font-medium-1">
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
                        {parseInt(item.price * item.quantity).toLocaleString()}{" "}
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
      </Modal.Body>
    </Modal>
  );
}
