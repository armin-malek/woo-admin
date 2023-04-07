import { showNoImage } from "../../../../server/common/functions";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { parseDateFull } from "../../../../server/common/time";
import woo from "../../../../server/common/woocommerce";

export default async function handler(req, res) {
  try {
    LimitHttpMethode(req, res, "GET");
    const response = await woo.get("products", {
      ...req.query,
    });

    response.data.map((item) => {
      if (item.images?.length > 0) item.image = item.images[0].src;
      else item.image = showNoImage();

      item.date_created = parseDateFull(item.date_created);
      item.date_modified = parseDateFull(item.date_modified);
    });

    res.send({
      status: true,
      products: response.data,
      pages: parseInt(response.headers["x-wp-totalpages"]),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
