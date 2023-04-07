import LayoutShop from "../../components/LayoutShop";
import { useEffect, useState } from "react";
import "swiper/css";
import ShopsListSkeleton from "../../components/shop/ShopsListSkeleton";
import MarketListItem from "../../components/shop/MarketListItem";
import axios from "axios";
import { toast } from "react-toastify";
import FooterMarkets from "../../components/FooterMarkets";
import Head from "next/head";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [markets, setMarkets] = useState();
  const [reloader, setReloader] = useState(false);

  async function getMarkets() {
    try {
      setIsLoading(true);
      const resp = await axios.get("/api/shop/get-my-markets");
      const { data } = resp;
      if (data.status != true) {
        toast("خطایی رخ داد");
        return;
      }
      setIsLoading(false);

      setMarkets(data.markets);
    } catch (err) {
      console.log(err);
      toast("خطایی رخ داد");
      return;
    }
  }
  useEffect(() => {
    getMarkets();
  }, []);
  useEffect(() => {
    console.log("effect reload");
    getMarkets();
  }, [reloader]);
  return (
    <>
      <Head>
        <title>بفرستو</title>
      </Head>
      <div className="row mt-4">
        {isLoading ? (
          Array(8)
            .fill(0)
            .map((item, index) => (
              <ShopsListSkeleton key={index}></ShopsListSkeleton>
            ))
        ) : (
          <>
            {markets?.map((item, index) => (
              <MarketListItem
                key={index}
                market={item?.Market}
              ></MarketListItem>
            ))}
          </>
        )}
      </div>
      <FooterMarkets getMarkets={getMarkets}></FooterMarkets>
    </>
  );
};

Page.protect = true;
Page.PageLayout = LayoutShop;

export default Page;
