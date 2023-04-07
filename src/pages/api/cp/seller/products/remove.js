import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { decodeInt } from "../../../../../server/common/functions";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const postSchema = z.object({
  productID: z.string(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    let { productID } = req.body;
    productID = decodeInt(productID);
    if (!productID) {
      return res.send({
        status: false,
        msg: "شناسه محصول صحیح نمی باشد",
      });
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    let marketProduct = await prisma.marketProducts.findUnique({
      where: {
        id: productID,
      },
      select: {
        Market: { select: { User: { select: { id: true } } } },
      },
    });

    if (marketProduct?.Market?.User?.id != session.user.id) {
      return res.send({
        status: false,
        msg: "این محصول متعلق به شما نیست!",
      });
    }

    await prisma.marketProducts.delete({
      where: { id: productID },
    });

    res.send({ status: true, msg: "محصول موردنظر از فروشگاه حذف شد.." });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
