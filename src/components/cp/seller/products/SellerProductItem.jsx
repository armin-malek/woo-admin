import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { priceLocale } from "../../../../server/common/functions";

export default function SellerProductItem({ marketProduct, handleShowModal }) {
  return (
    //d-flex align-items-stretch
    // w-100
    <div className="col-6 col-md-4 col-lg-3 col-xl-2">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <span className="badge badge-danger float-left"></span>
          <figure className="product-image">
            <img src={marketProduct?.Product?.Image} />
          </figure>
          <span className="text-dark mb-1 mt-2 h6 d-block  text-center">
            {marketProduct?.ProductInfo?.name}
          </span>

          {marketProduct.inStock > 0 ? (
            <>
              <p className="mb-0 text-center" style={{ fontSize: "15px" }}>
                موجودی: {marketProduct.inStock}
              </p>

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

              <div className="d-flex mt-2 justify-content-center">
                <button
                  className="btn btn-info"
                  onClick={() => handleShowModal(marketProduct)}
                >
                  <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>{" "}
                  ویرایش
                </button>
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
