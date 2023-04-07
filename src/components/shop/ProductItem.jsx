import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState, useContext, useEffect } from "react";

import { CartContext } from "../../context/CartContex";
import { priceLocale } from "../../server/common/functions";

export default function ProductItem({ marketProduct }) {
  const cart = useContext(CartContext);
  const [amount, setAmount] = useState(
    cart.getProductQuantity(marketProduct.id)
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
    //d-flex align-items-stretch
    // w-100
    <div className="col-6 col-md-4 col-lg-3 col-xl-2">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          {marketProduct?.ProductInfo?.specialPrice && (
            <span className="badge badge-danger float-left">
              {parseInt(
                marketProduct?.ProductInfo?.basePrice /
                  (marketProduct?.ProductInfo?.basePrice -
                    marketProduct?.ProductInfo?.specialPrice)
              )}
              % تخفیف
            </span>
          )}
          <figure className="product-image">
            <img src={marketProduct.Product.Image} />
          </figure>
          <span className="text-dark mb-1 mt-2 h6 d-block  text-center">
            {marketProduct?.ProductInfo?.name}
          </span>

          {marketProduct.inStock > 0 ? (
            <>
              {marketProduct?.ProductInfo?.specialPrice ? (
                <>
                  <div className="d-flex justify-content-center">
                    <s
                      className="text-danger"
                      style={{ fontSize: "13px", marginBottom: "-11px" }}
                    >
                      {priceLocale(marketProduct?.ProductInfo?.basePrice)}
                    </s>
                  </div>
                  <p className="text-success font-weight-normal mb-0  text-center">
                    {priceLocale(marketProduct?.ProductInfo?.specialPrice)}
                  </p>
                </>
              ) : (
                <p className="text-success font-weight-normal mb-0  text-center">
                  {priceLocale(marketProduct?.ProductInfo?.basePrice)}
                </p>
              )}
              <div className="col-auto align-self-center mt-2">
                <div
                  className="input-group input-group-sm mx-auto"
                  style={{ maxWidth: "100px" }}
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
                    disabled
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                  ></input>
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
            </>
          ) : (
            <p className="text-danger font-weight-normal mb-0 text-center">
              ناموجود
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/*
<button className="btn btn-sm btn-link p-0">
            <span></span>
          </button>
          <!-- -->
          <div className="badge badge-success float-left">%10 تخفیف</div>
          */
