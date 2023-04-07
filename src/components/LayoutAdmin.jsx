import Head from "next/head";
import { useState } from "react";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function LayoutAdmin({ children }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const { data: session, status: sessionStatus } = useSession();

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
        <meta name="description" content=""></meta>
        <meta name="author" content="Armin Esmaeili"></meta>
        <title>مدریت نی نی تو</title>
      </Head>

      <main
        className={`pink-theme ${
          sideMenuOpen ? "sidemenu-open menuactive" : ""
        }`}
      >
        <div className="sidebar">
          <div className="row mx-0">
            <div className="col">
              <h5 className="subtitle text-uppercase">
                <span>منو</span>
              </h5>
              <div className="list-group main-menu">
                <Link
                  href="/panel"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  داشبورد
                </Link>
                <Link
                  href="/panel/orders"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  سفارشات
                </Link>
                <Link
                  href="/panel/products"
                  className="list-group-item list-group-item-action"
                  onClick={handleSideMenu}
                >
                  محصولات
                </Link>

                {sessionStatus == "authenticated" ? (
                  <button
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
