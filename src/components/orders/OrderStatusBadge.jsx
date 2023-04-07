import { orderStatusFa } from "../../server/common/functions";

const OrderStatusBadge = ({ status, styles }) => {
  function renderStatusBadge() {
    if (["WaitingMarket", "PreparedByMarket", "OnDelivery"].includes(status)) {
      return (
        <span
          className="badge badge-info"
          style={{
            color: "white",
            ...styles,
          }}
        >
          {orderStatusFa(status)}
        </span>
      );
    }
    if (status == "Completed") {
      return (
        <span
          className="badge badge-success"
          style={{
            color: "white",
            ...styles,
          }}
        >
          {orderStatusFa(status)}
        </span>
      );
    }
    if (["Canceled", "Returned"].includes(status)) {
      return (
        <span
          className="badge badge-danger"
          style={{
            color: "white",
            ...styles,
          }}
        >
          {orderStatusFa(status)}
        </span>
      );
    }
    if (status == "Unpaid") {
      return (
        <span
          className="badge badge-secondary"
          style={{
            color: "white",
            ...styles,
          }}
        >
          {orderStatusFa(status)}
        </span>
      );
    }
  }

  return (
    <>
      {renderStatusBadge()}{" "}
      <style jsx>{`
        .badge-success {
          background-color: #eefbf3 !important;
        }
        .badge-info {
          background-color: #3737a64a !important;
        }
        .badge-danger {
          /*background-color: #eefbf3 !important;*/
        }
        .badge-warning {
          background-color: #ffc40042 !important;
        }
      `}</style>
    </>
  );
};
export default OrderStatusBadge;
