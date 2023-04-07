import {
  faCircleMinus,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../../context/CartContex";
import { priceLocale } from "../../../server/common/functions";

export default function CartProduct({ marketProduct }) {
  const cart = useContext(CartContext);
  const [amount, setAmount] = useState(
    cart.getProductQuantity(marketProduct.id)
  );
  const [price, setPrice] = useState(
    marketProduct?.ProductInfo?.specialPrice
      ? marketProduct?.ProductInfo?.specialPrice
      : marketProduct?.ProductInfo?.basePrice
  );

  function handleAmountIncrease() {
    cart.addToCart(marketProduct, 1);
    setAmount(amount + 1);
  }
  function handleAmountDecrease() {
    if (amount >= 1) {
      setAmount(amount - 1);
      cart.removeFromCart(marketProduct.id, 1);
    }
  }

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-auto align-self-center">
          <button
            className="btn btn-sm btn-link p-0 float-right"
            onClick={() => {
              cart.deleteFromCart(marketProduct.id);
            }}
          >
            <FontAwesomeIcon icon={faCircleMinus} size="2x"></FontAwesomeIcon>
          </button>
        </div>
        <div className="col-2 pl-0 align-self-center">
          <figure className="product-image h-auto">
            <Image
              src={marketProduct?.Product?.Image}
              width={55}
              height={55}
              alt="تصویر محصول"
            />
          </figure>
        </div>
        <div className="col px-0 text-center ">
          <span className="text-dark mb-1 h6 d-block mt-3">
            {marketProduct?.ProductInfo?.name}
          </span>

          <h5
            className="text-success font-weight-normal mb-0"
            style={{ fontSize: "18px" }}
          >
            {Math.round(price * amount).toLocaleString()} تومان
          </h5>
        </div>
        <div className="col-auto align-self-center">
          <div
            className="input-group input-group-sm"
            style={{ width: "100px" }}
          >
            <div className="input-group-prepend">
              <button
                className="btn btn-light-grey px-1"
                type="button"
                onClick={() => handleAmountDecrease()}
              >
                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
              </button>
            </div>
            <input
              type="text"
              className="form-control w-35"
              placeholder=""
              value={amount}
              disabled
              style={{ color: "black" }}
              //onChange={handleAmountEdit}
            />
            <div className="input-group-append">
              <button
                className="btn btn-light-grey px-1"
                type="button"
                onClick={() => handleAmountIncrease()}
              >
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
