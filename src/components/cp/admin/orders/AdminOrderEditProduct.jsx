import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

export default function AdminOrderEditProduct({
  item,
  HandleEdit,
  HandleRemove,
}) {
  const [amount, setAmount] = useState(item.quantity);

  function handleQuantityEdit(value) {
    let newAmount = amount + value;
    if (newAmount > 0) {
      setAmount(newAmount);
      HandleEdit(item.id, newAmount);
    }
  }
  function handleAmountIncrease() {
    let newAmount = amount;
    if (amount == 0.5) {
      newAmount = amount + 0.5;
    } else if (amount > 0) {
      newAmount = amount + 1;
    } else if (amount == 0) {
      newAmount = 0.5;
    }
    HandleEdit(item.id, newAmount);
    setAmount(newAmount);
  }
  function handleAmountDecrease() {
    let toRemove = 0;
    if (amount == 1) {
      toRemove = 0.5;
    } else if (amount > 1) {
      toRemove = 1;
    } else if (amount == 0.5) {
      toRemove = 0.5;
    }
    let newAmount = amount - toRemove;
    HandleEdit(item.id, newAmount);
    setAmount(newAmount);
  }
  function handleQuantityChange(e) {
    let value = parseInt(e.target.value);
    if (value > 0) {
      setAmount(value);
      HandleEdit(item.id, value);
    }
  }
  return (
    <tr className="border-bottom">
      <th scope="row">
        <button className="btn">
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => HandleRemove(item.id)}
            style={{ height: "20px" }}
          ></FontAwesomeIcon>
        </button>
      </th>
      <td>{item.name}</td>
      <td>{Math.round(item.price * item.quantity).toLocaleString()} تومان</td>
      <td>
        <div className="input-group input-group-sm">
          <div className="input-group-prepend">
            <button
              className="btn btn-light-grey px-1"
              type="button"
              onClick={() => handleAmountDecrease()}
            >
              <FontAwesomeIcon
                icon={faMinus}
                style={{ height: "20px" }}
              ></FontAwesomeIcon>
            </button>
          </div>
          <input
            type="text"
            className="form-control w-35"
            placeholder=""
            value={amount}
            disabled
            //nChange={handleQuantityChange}
          />
          <div className="input-group-append">
            <button
              className="btn btn-light-grey px-1"
              type="button"
              onClick={() => handleAmountIncrease()}
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ height: "20px" }}
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
