import {
  faLocationDot,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function MarketListItem({ market }) {
  return (
    <>
      <div className="col-12 col-sm-12 col-md-4 mb-3">
        <div className="card" style={{ width: "18rem" }}>
          <Image
            src={market.Image}
            alt=""
            width={500}
            height={500}
            style={{
              width: "100%",
              height: "150px",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
            }}
          ></Image>

          <div
            style={{
              width: "4.5rem",
              height: "4.5rem",
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: "0.75rem",
              boxShadow:
                "rgb(58 61 66 / 6%) 0px 1px 0px, rgb(0 0 0 / 30%) 0px 8px 32px -16px",
              position: "absolute",
              right: "0px",
              left: "0px",
              margin: "auto",
              transform: "translateY(5.4rem)",
            }}
          >
            <Image
              src={market.logo}
              alt=""
              width={150}
              height={150}
              style={{ width: "100%", height: "100%", padding: "5px" }}
            ></Image>
          </div>
          <div className="card-body text-center">
            <h2 style={{ fontSize: "20px" }}>{market.name}</h2>
            <p className="card-text" style={{ color: "#646464" }}>
              <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon> {""}
              {`${market.marketAddress?.City?.name}، ${market.marketAddress?.Region?.name}`}
            </p>

            <Link href={`/shop/${market.id}`}>
              <span
                style={{
                  backgroundColor: "#5d3ebd",
                  color: "#ffffff",
                  borderRadius: "50px",
                  padding: "5px 15px",
                }}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  style={{ paddingLeft: "5px" }}
                ></FontAwesomeIcon>
                خرید
              </span>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{``}</style>
    </>
  );
}
