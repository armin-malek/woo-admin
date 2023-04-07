import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { decodeInt, showNoImage } from "../../../../../server/common/functions";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { fileUrl } from "../../../../../server/common/s3";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const postSchema = z.object({
  barCode: z.string(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { barCode } = req.body;

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    const product = await prisma.product.findUnique({
      where: { barcode: barCode },
      select: {
        id: true,
        barcode: true,
        Image: { select: { File: { select: { name: true } } } },
        isVisible: true,
        ProductInfo: {
          select: { name: true, basePrice: true, specialPrice: true },
        },
      },
    });
    if (!product || product.isVisible == false) {
      return res.send({
        status: false,
        msg: "محصول مورد نظر در کاتالوگ وجود ندارد!",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { MarketOwned: { select: { id: true } } },
    });

    let marketProduct = await prisma.marketProducts.findUnique({
      where: {
        productId_marketId: {
          marketId: user.MarketOwned.id,
          productId: product.id,
        },
      },
    });

    if (marketProduct) {
      return res.send({
        status: false,
        msg: "محصول مورد نظر قبلا به فروشگاه شما اضافه شده!",
      });
    }

    product.Image = fileUrl(product.Image?.File?.name) || showNoImage();

    res.send({ status: true, data: product });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
