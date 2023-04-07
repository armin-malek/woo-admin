import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminWithdrawTableItem({ withdraw, handleView }) {
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
        <td className="align-middle">
          {withdraw.status == "Requested" && (
            <button className="btn" onClick={() => handleView(withdraw)}>
              <FontAwesomeIcon
                style={{
                  height: "25px",
                  color: "#0081C9",
                }}
                icon={faEye}
              ></FontAwesomeIcon>
            </button>
          )}
        </td>
        <td className="align-middle">{withdraw.id}</td>
        <td className="align-middle">
          <a href={`tel:${withdraw.Market.User.mobile}`}>
            {withdraw.Market.User.fullName} - {withdraw.Market.User.mobile}
          </a>
        </td>
        <td className="align-middle">{withdraw.Market?.name}</td>
        <td className="align-middle">{withdraw.amount}</td>
        <td className="align-middle">{renderStatus(withdraw.status)}</td>
        <td className="align-middle">{withdraw.bankTransactionCode}</td>
        <td className="align-middle" dir="ltr">
          {withdraw.dateCreated}
        </td>
        <td className="align-middle" dir="ltr">
          {withdraw.dateCompleted}
        </td>
      </tr>
    </>
  );
}
