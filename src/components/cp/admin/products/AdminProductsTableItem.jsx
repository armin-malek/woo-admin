import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { priceLocale } from "../../../../server/common/functions";

export default function AdminProductsTableItem({ product, handleView }) {
  return (
    <>
      <tr>
        <td className="align-middle">
          <button className="btn" onClick={() => handleView(product)}>
            <FontAwesomeIcon
              style={{
                height: "25px",
                color: "#0081C9",
              }}
              icon={faEye}
            ></FontAwesomeIcon>
          </button>
        </td>
        <td className="align-middle">{product.ProductInfo.name}</td>
        <td className="align-middle">{product.barcode}</td>
        <td className="align-middle">
          {priceLocale(product.ProductInfo.basePrice)}
        </td>
        <td className="align-middle">{product._count.MarketProducts}</td>
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
