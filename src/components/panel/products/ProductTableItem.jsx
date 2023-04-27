import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { priceLocale, stringCut } from "../../../server/common/functions";
import Image from "next/image";
import Link from "next/link";

export default function ProductTableItem({ product }) {
  return (
    <>
      <tr>
        <td className="align-middle">
          <Link href={`/panel/products/${product.id}`}>
            <FontAwesomeIcon
              style={{
                height: "25px",
                color: "#0081C9",
              }}
              icon={faEye}
            ></FontAwesomeIcon>
          </Link>
        </td>
        <td style={{ verticalAlign: "middle" }}>
          {/*
          <Image src={product.image} alt="" width={50} height={50} />
           */}
          <img
            src={product.image}
            alt="product image"
            style={{ width: "50px", height: "50px" }}
          />
        </td>
        <td className="align-middle">{stringCut(product.name, 25)}</td>
        <td className="align-middle">{stockStatus(product)}</td>
        <td className="align-middle">{priceLocale(product.price)}</td>

        <td className="align-middle">
          {product.categories?.map((item, index) => (
            <span key={index} className="badge badge-secondary ml-1">
              {item.name}
            </span>
          ))}
        </td>
        <td className="align-middle" dir="ltr">
          {product.date_modified
            ? `ویرایش در ${product.date_modified}`
            : `ایجاد در ${product.date_created}`}
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
function stockStatus(product) {
  if (product.stock_status == "instock") {
    return (
      <span className="badge badge-success">
        موجود
        {product.stock_quantity ? ` (${product.stock_quantity})` : ""}
      </span>
    );
  }
  if (product.stock_status == "outofstock") {
    return <span className="badge badge-warning">نا موجود</span>;
  }
  if (product.stock_status == "onbackorder") {
    return <span className="badge badge-secondary">پیش سفارش</span>;
  }
}
