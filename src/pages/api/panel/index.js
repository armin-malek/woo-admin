import moment from "moment-timezone";
import { LimitHttpMethode } from "../../../server/common/requests";
import woo from "../../../server/common/woocommerce";

export default async function handler(req, res) {
  try {
    //const { per_page, page, search, status } = req.query;
    LimitHttpMethode(req, res, "GET");
    const completedOrdersReq = woo.get("orders", {
      per_page: 1,
      //after: moment().subtract("30", "days").toISOString(),
      status: "completed",
    });
    const inProgressOrdersReq = woo.get("orders", {
      per_page: 1,
      status: "processing",
    });
    const productsReq = woo.get("products", {
      per_page: 1,
    });

    const [completedOrders, inProgressOrders, products] = await Promise.all([
      completedOrdersReq,
      inProgressOrdersReq,
      productsReq,
    ]);

    res.send({
      status: true,
      completedOrders: completedOrders.headers["x-wp-total"],
      inProgressOrders: inProgressOrders.headers["x-wp-total"],
      products: products.headers["x-wp-total"],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
