import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";

export default function LayoutSeller({ children }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [menuInfoLoading, setMenuInfoLoading] = useState(false);
  const [menuInfo, setMenuInfo] = useState();

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    async function getUserInfo() {
      try {
        setMenuInfoLoading(true);
        const fetchResp = await fetch("/api/shop/get-myinfo");
        const resp = await fetchResp.json();
        setMenuInfoLoading(false);
        if (resp.status != true) {
          return;
        }
        setMenuInfo(resp.data);
      } catch (err) {
        console.log(err);
        setMenuInfoLoading(false);
      }
    }
    getUserInfo();
  }, []);

  function handleSideMenu() {
    setSideMenuOpen(!sideMenuOpen);
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no"
        ></meta>
        <meta name="description" content="پنل فروشندگان بفرستو"></meta>
        <meta name="author" content="Armin Esmaeili"></meta>
        <title>پنل فروشنده - بفرستو</title>

        <link rel="apple-touch-icon" href="/icons/logo-192x.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/logo-192x.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/logo-192x.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/logo-192x.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="640x1136"
        />
      </Head>

      <main
        className={`pink-theme ${
          sideMenuOpen ? "sidemenu-open menuactive" : ""
        }`}
      >
        <div className="sidebar">
          <div className="text-center">
            <div className="figure-menu shadow">
              <figure>
                <img src="/img/reseller.png" alt="" />
              </figure>
            </div>
            {menuInfoLoading ? (
              <>
                <Skeleton width={100}></Skeleton>
              </>
            ) : (
              <>
                <h5 className="mb-1 ">{menuInfo ? menuInfo?.fullName : ""}</h5>
              </>
            )}
          </div>
          <br />
          <div className="row mx-0">
            <div className="col">
              <h5 className="subtitle text-uppercase">
                <span>منو</span>
              </h5>
              <div className="list-group main-menu">
                <Link
                  href="/cp/seller"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  داشبورد
                </Link>
                <Link
                  href="/cp/seller/products"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  محصولات
                </Link>
                <Link
                  href="/cp/seller/orders"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  سفارشات
                </Link>
                <Link
                  href="/cp/seller/customers"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  مشتریان
                </Link>
                <Link
                  href="/cp/seller/withdraw"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  تسویه حساب
                </Link>
                {sessionStatus == "authenticated" ? (
                  <button
                    href="login.html"
                    className="list-group-item list-group-item-action mt-4"
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  >
                    خروج از حساب
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="list-group-item list-group-item-action mt-4"
                    onClick={handleSideMenu}
                  >
                    ورود / ثبت نام
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="wrapper"
          onClick={() => {
            if (sideMenuOpen) setSideMenuOpen(!sideMenuOpen);
          }}
        >
          <div className="header">
            <div className="row no-gutters">
              <div className="col-auto">
                <button
                  className="btn  btn-link text-dark menu-btn"
                  onClick={handleSideMenu}
                >
                  <img src="/img/menu.png" alt="" />
                  <span className="new-notification" />
                </button>
              </div>
              <div className="col text-center">
                <img
                  src="/img/logo-header.png"
                  alt=""
                  className="header-logo"
                  style={{ marginLeft: "54px" }}
                />
              </div>
            </div>
          </div>

          <div className="container">{children}</div>
        </div>
      </main>
    </>
  );
}
