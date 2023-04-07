import { faEye, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderStatusBadge from "../../../orders/OrderStatusBadge";

export default function AdminOrderTableItem({
  order,
  handleView,
  handleShowEdit,
}) {
  function clickView() {
    switch (order.status) {
      case "Completed":
        handleView(order);
        break;
      default:
        handleShowEdit(order);
        break;
    }
  }
  return (
    <>
      <tr>
        <td className="align-middle">
          <button className="btn" onClick={clickView}>
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
        <td className="align-middle">{order.Customer.User.fullName}</td>
        <td className="align-middle">{order.Market.name}</td>
        <td className="align-middle">{order.deliveredDate}</td>
        <td className="align-middle">
          <OrderStatusBadge status={order?.status} />
        </td>
        <td className="align-middle">
          {order?.Payment?.PaymentMethode == "Online" && "آنلاین"}
          {order?.Payment?.PaymentMethode == "Offline" && "نقدی"}
        </td>
        <td className="align-middle" style={{ minWidth: "170px" }}>
          {parseInt(order.amount).toLocaleString()} تومان
        </td>{" "}
        <td className="align-middle">
          <a
            className="btn btn-info"
            href={`https://www.google.com/maps/search/?api=1&query=${order.CustomerAddress.gpsLat},${order.CustomerAddress.gpsLong}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#fff" }}
          >
            <FontAwesomeIcon icon={faMapLocationDot} />
          </a>
        </td>
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
