import { orderStatusFa } from "../../../server/common/functions";

const OrderStatusBadge = ({ status, styles }) => {
  function renderStatusBadge() {
    if (status == "processing") {
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
    if (status == "completed") {
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
    if (["cancelled", "failed"].includes(status)) {
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
    if (["on-hold"].includes(status)) {
      return (
        <span
          className="badge badge-warning"
          style={{
            color: "white",
            ...styles,
          }}
        >
          {orderStatusFa(status)}
        </span>
      );
    }
    if (["pending", "refunded", "checkout-draft"].includes(status)) {
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
