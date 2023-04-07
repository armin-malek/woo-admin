import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderStatusBadge from "../../../orders/OrderStatusBadge";

export default function SellerCustomerTableItem({ customer }) {
  return (
    <>
      <tr>
        <td className="align-middle">{customer.User.fullName}</td>
        <td className="align-middle">
          <a href={`tel:${customer.User.mobile}`}>{customer.User.mobile}</a>
        </td>
        <td className="align-middle" dir="ltr">
          {customer.User.dateRegister}
        </td>
        <td className="align-middle">
          {customer.User.lastLogin ? (
            <span className="badge badge-success">فعال</span>
          ) : (
            <span className="badge badge-warning">غیر فعال</span>
          )}
        </td>
        <td className="align-middle">{customer.orderCount} سفارش</td>
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
