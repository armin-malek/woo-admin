import { useState, useContext, useEffect } from "react";
import {
  faCircleUser,
  faList,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShoppingBag } from "@mui/icons-material";
import { CartContext } from "../context/CartContex";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import { priceToFaText } from "../server/common/functions";
import { useRouter } from "next/router";

export default function FooterShop({ children }) {
  const cart = useContext(CartContext);
  const router = useRouter();
  const { marketID } = router.query;
  return (
    <>
      <div className="footer">
        <div className="no-gutters">
          <div className="col-auto mx-auto">
            <div className="row no-gutters justify-content-center">
              <div className="col-auto">
                <Link href="/shop" className="btn btn-link-default">
                  <FontAwesomeIcon icon={faShop}></FontAwesomeIcon>
                </Link>
              </div>
              <div className="col-auto">
                <Link
                  href={`/shop/${marketID}/cart`}
                  className="btn btn-default shadow centerbutton"
                >
                  <ShoppingBag />

                  <span
                    //className={cart.items.length > 0 ? "" : "d-none"}
                    style={{
                      transitionDuration: "0.3s",
                      //visibility: cart.items.length > 0 ? "visible" : "hidden",
                    }}
                  >
                    <span
                      className="badge badge-pill badge-primary"
                      style={{ position: "absolute", top: "-20px" }}
                    >
                      {cart.getItems().length > 0 ? cart.getItems().length : ""}
                    </span>
                    <span
                      className="badge badge-pill"
                      dir="rtl"
                      style={{
                        position: "absolute",
                        top: "-40px",
                        right: "5px",
                        backgroundColor: "#15d256",
                        color: "white",
                      }}
                    >
                      {cart.getTotalCost() > 0
                        ? priceToFaText(cart.getTotalCost())
                        : ""}
                    </span>
                  </span>
                </Link>
              </div>

              <div className="col-auto">
                <Link href="/shop/orders" className="btn btn-link-default ">
                  <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
