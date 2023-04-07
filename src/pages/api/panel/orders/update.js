import { z } from "zod";
import woo from "../../../../server/common/woocommerce";
import { LimitHttpMethode } from "../../../../server/common/requests";

const postSchema = z.object({
  orderID: z.number(),
  status: z.enum([
    "pending",
    "processing",
    "on-hold",
    "completed",
    "cancelled",
    "refunded",
    "failed",
  ]),
});

export default async function handler(req, res) {
  try {
    LimitHttpMethode(req, res, "POST");
    if (!postSchema.safeParse(req.body).success) {
      return res.send({ status: false, msg: "اطلاعات ارسالی نا صحیح" });
    }
    const { orderID, status } = req.body;
    const response = await woo.put(`orders/${orderID}`, {
      status,
    });

    if (response.status != 200) {
      console.log(response.data);
      return res.send({ status: false, msg: "خطای در سرور" });
    }
    res.send({
      status: true,
      msg: "ویرایش موفق",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
