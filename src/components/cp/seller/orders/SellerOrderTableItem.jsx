import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderStatusBadge from "../../../orders/OrderStatusBadge";

export default function SellerOrderTableItem({
  order,
  handleView,
  handleShowEdit,
}) {
  function clickView() {
    if (order.status == "WaitingMarket") {
      handleShowEdit(order);
      return;
    }
    handleView(order);
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
        <td className="align-middle">
          <a href={`tel:${order.Customer.User.mobile}`}>
            {order.Customer.User.fullName} - {order.Customer.User.mobile}
          </a>
        </td>
        <td className="align-middle">{order.date}</td>
        <td className="align-middle">
          <OrderStatusBadge status={order.status} />
        </td>
        <td className="align-middle" style={{ minWidth: "170px" }}>
          {parseInt(order.amount).toLocaleString()} تومان
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
