import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderStatusBadge from "./OrderStatusBadge";
import { priceLocale } from "../../../server/common/functions";

export default function OrderTableItem({ order, handleShowEdit }) {
  return (
    <>
      <tr>
        <td className="align-middle">
          <button className="btn" onClick={() => handleShowEdit(order)}>
            <FontAwesomeIcon
              style={{
                height: "25px",
                color: "#0081C9",
              }}
              icon={faEye}
            ></FontAwesomeIcon>
          </button>
        </td>
        <td className="align-middle">{`#${order.id} ${order.billing.first_name} ${order.billing.last_name}`}</td>
        <td className="align-middle" dir="ltr">
          {order.date_created}
        </td>
        <td className="align-middle">
          <OrderStatusBadge status={order?.status} />
        </td>
        <td className="align-middle">{priceLocale(order.total)}</td>
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
