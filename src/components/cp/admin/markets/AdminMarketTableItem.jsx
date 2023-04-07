import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminMarketTableItem({ market, handleView }) {
  return (
    <>
      <tr>
        <td className="align-middle">
          <button className="btn" onClick={() => handleView(market)}>
            <FontAwesomeIcon
              style={{
                height: "25px",
                color: "#0081C9",
              }}
              icon={faEye}
            ></FontAwesomeIcon>
          </button>
        </td>
        <td className="align-middle">{market.name}</td>
        <td className="align-middle">{market.User.fullName}</td>
        <td className="align-middle">{market.User.mobile}</td>
        <td className="align-middle">{market.marketAddress.address}</td>
        <td className="align-middle">{market._count.MarketOrder}</td>
        <td className="align-middle">{market._count.CustomerMarkets}</td>
        <td className="align-middle">{market._count.MarketProducts}</td>
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
