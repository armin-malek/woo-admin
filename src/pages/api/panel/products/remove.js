import { z } from "zod";
import woo from "../../../../server/common/woocommerce";
import { LimitHttpMethode } from "../../../../server/common/requests";

const postSchema = z.object({
  productID: z.number(),
  force: z.boolean(),
});

export default async function handler(req, res) {
  try {
    LimitHttpMethode(req, res, "POST");
    if (!postSchema.safeParse(req.body).success) {
      return res.send({ status: false, msg: "اطلاعات ارسالی نا صحیح" });
    }
    const { productID, force } = req.body;

    const response = await woo.delete(`products/${productID}`, { force });

    res.send({
      status: true,
      msg: force ? "محصول حذف شد" : "محصول به زباله دان منتقل شد",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
