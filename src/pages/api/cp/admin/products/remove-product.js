import { z } from "zod";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { prisma } from "../../../../../server/db/client";

const postSchema = z.object({
  productId: z.number(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { productId } = req.body;

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    res.send({ status: true, msg: "محصول با موفقیت حذف شد" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
