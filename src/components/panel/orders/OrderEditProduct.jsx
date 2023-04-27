import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { priceLocale } from "../../../server/common/functions";

export default function AdminOrderEditProduct({ item }) {
  return (
    <tr className="border-bottom">
      <td>
        {/*
        <Image src={item?.image?.src} alt="" width={50} height={50} />
         */}
        <img
          src={item?.image?.src}
          alt="product image"
          style={{ width: "50px", height: "50px" }}
        />
      </td>
      <td>
        <a
          href={`https://niniyeto.ir/wp-admin/post.php?post=${item.product_id}&action=edit`}
          target="_blank"
          rel="noreferrer"
        >
          #{item.product_id} {item.name?.slice(0, 20)}
        </a>
      </td>
      <td>{priceLocale(item.price)}</td>
      <td>x {item.quantity}</td>
      <td>{priceLocale(item.total)}</td>
    </tr>
  );
}
