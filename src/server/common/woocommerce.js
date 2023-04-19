import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const woo = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOO_SITE,
  consumerKey: process.env.WOO_KEY,
  consumerSecret: process.env.WOO_SECRET,
  version: "wc/v3",
});
export default woo;
