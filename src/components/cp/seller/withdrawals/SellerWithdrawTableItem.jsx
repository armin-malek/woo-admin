import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { priceLocale } from "../../../../server/common/functions";

export default function SellerwithdrawTableItem({ withdraw, handleView }) {
  function renderStatus(status) {
    switch (status) {
      case "Completed":
        return <span className="badge badge-success"> پرداخت شده</span>;
      case "Rejected":
        return <span className="badge badge-danger">رد شده</span>;
      case "Requested":
        return <span className="badge badge-info">در صف بررسی</span>;
    }
  }

  return (
    <>
      <tr>
        <td className="align-middle">{withdraw.id}</td>
        <td className="align-middle">{priceLocale(withdraw.amount)}</td>
        <td className="align-middle">{renderStatus(withdraw.status)}</td>
        <td className="align-middle" dir="ltr">
          {withdraw.dateCreated}
        </td>
        <td className="align-middle" dir="ltr">
          {withdraw.dateCompleted}
        </td>
        <td className="align-middle">{withdraw.bankTransactionCode}</td>
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
