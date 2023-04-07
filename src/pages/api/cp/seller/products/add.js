import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const postSchema = z.object({
  productID: z.number(),
  name: z.string(),
  inStock: z.number().min(0),
  basePrice: z.number().min(1),
  specialPrice: z.number().nullable(),
  isVisible: z.boolean(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { productID, name, inStock, basePrice, specialPrice, isVisible } =
      req.body;

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { MarketOwned: { select: { id: true } } },
    });

    await prisma.marketProducts.create({
      data: {
        Market: { connect: { id: user.MarketOwned.id } },
        inStock: inStock,
        isVisible: isVisible,
        Product: { connect: { id: productID } },
        ProductInfo: {
          create: {
            name: name.trim(),
            basePrice: basePrice,
            specialPrice: specialPrice ? specialPrice : undefined,
          },
        },
      },
    });

    res.send({ status: true, msg: "محصول موردنظر به فروشگاه اضافه شد.." });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
