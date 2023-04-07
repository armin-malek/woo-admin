import "bootstrap/dist/css/bootstrap.min.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import LayoutBase from "../components/LayoutBase";
import CartProvider from "../context/CartContex";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="font-fa"
        />
      </CartProvider>
    </SessionProvider>
  );
};

export default MyApp;
