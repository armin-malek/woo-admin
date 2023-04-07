import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OrderTableItem({ order, handleView, handleShowEdit }) {
  return (
    <>
      <tr>
        <td className="align-middle" style={{ minWidth: "170px" }}>
          <button
            className="btn"
            disabled={order.status == "Submitted" ? false : true}
            onClick={() => handleShowEdit(order)}
          >
            <FontAwesomeIcon
              style={{
                height: "25px",
                color: "#54B435",
              }}
              icon={faPenToSquare}
            ></FontAwesomeIcon>
          </button>
          <button className="btn mr-4" onClick={() => handleView(order)}>
            <FontAwesomeIcon
              style={{
                height: "25px",
                color: "#0081C9",
              }}
              icon={faEye}
            ></FontAwesomeIcon>
          </button>
        </td>
        <td className="align-middle">{order.id}</td>
        <td className="align-middle">{order.date}</td>
        <td className="align-middle">
          {order.status == "Submitted" ? (
            <span
              className="badge badge-pill badge-info"
              style={{ fontSize: "14px" }}
            >
              ثبت شده
            </span>
          ) : order.status == "WaitingAdmin" ? (
            <span
              className="badge badge-pill badge-warning"
              style={{ fontSize: "14px" }}
            >
              در حال آماده سازی
            </span>
          ) : order.status == "Preparing" ? (
            <span
              className="badge badge-pill badge-warning"
              style={{ fontSize: "14px" }}
            >
              در حال آماده سازی
            </span>
          ) : order.status == "Completed" ? (
            <span
              className="badge badge-pill badge-success"
              style={{ fontSize: "14px" }}
            >
              تکمیل شده
            </span>
          ) : order.status == "Canceled" ? (
            <span
              className="badge badge-pill badge-secondary"
              style={{ fontSize: "14px" }}
            >
              لفو شده
            </span>
          ) : (
            ""
          )}
        </td>
        <td className="align-middle">{order?.paymentMethodeName}</td>
        <td className="align-middle" style={{ minWidth: "170px" }}>
          {Math.round(order.amount).toLocaleString()} تومان
        </td>
        <td className="align-middle">{order.points}</td>
      </tr>
      <style jsx>{`
        td {
          padding-top: 4px;
          padding-bottom: 4px;
        }
      `}</style>
    </>
  );
}
