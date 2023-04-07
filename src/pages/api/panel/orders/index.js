import { LimitHttpMethode } from "../../../../server/common/requests";
import { parseDateFull } from "../../../../server/common/time";
import woo from "../../../../server/common/woocommerce";

export default async function handler(req, res) {
  try {
    //const { per_page, page, search, status } = req.query;
    LimitHttpMethode(req, res, "GET");
    const response = await woo.get("orders", {
      ...req.query,
    });

    response.data.map((order) => {
      order.date_created = parseDateFull(order.date_created);
      order.date_modified = parseDateFull(order.date_modified);
    });

    res.send({
      status: true,
      orders: response.data,
      pages: parseInt(response.headers["x-wp-totalpages"]),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
