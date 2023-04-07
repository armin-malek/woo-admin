import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import OrderStatusBadge from "../../../orders/OrderStatusBadge";

export default function SellerCatalogueTableItem({ product, ToggleAddModal }) {
  return (
    <>
      <tr>
        <td className="align-middle">
          <Image src={product.Image} alt="" width={40} height={40}></Image>
        </td>
        <td className="align-middle">{product.id}</td>
        <td className="align-middle">{product.ProductInfo.name}</td>
        <td className="align-middle">
          {product.hasProduct ? (
            <span className="badge badge-success" style={{ fontSize: "15px" }}>
              موجود در فروشگاه
            </span>
          ) : (
            <span
              className="badge badge-primary"
              onClick={() => ToggleAddModal(product)}
              style={{ fontSize: "15px", cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="pl-1"
                style={{ height: "18px" }}
              ></FontAwesomeIcon>
              افزودن
            </span>
          )}
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
