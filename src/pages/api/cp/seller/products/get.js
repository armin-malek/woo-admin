import {
  decodeInt,
  encodeInt,
  showNoImage,
} from "../../../../../server/common/functions";
import { getServerAuthSession } from "../../../../../server/common/get-server-auth-session";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { fileUrl } from "../../../../../server/common/s3";
import { prisma } from "../../../../../server/db/client";
const itemCount = 12;
const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    let { cat, query, cursor } = req.query;
    cursor = decodeInt(cursor);

    const session = await getServerAuthSession({ req, res });
    const market = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: { MarketOwned: { select: { id: true } } },
    });

    let marketProducts = await prisma.marketProducts.findMany({
      where: {
        Product: {
          ProductCategory: {
            slug: cat?.toString() || undefined,
          },
          ProductInfo: { name: { contains: query?.toString() } },
          isVisible: true,
        },
        Market: { id: market.MarketOwned.id },
      },
      select: {
        id: true,
        inStock: true,
        isVisible: true,
        Product: {
          select: { Image: { select: { File: { select: { name: true } } } } },
        },
        ProductInfo: {
          select: {
            basePrice: true,
            name: true,
            shortDesc: true,
            specialPrice: true,
          },
        },
      },
      take: itemCount,
      skip: cursor ? 1 : undefined, // Skip the cursor
      cursor: cursor ? { id: cursor } : undefined,
    });
    marketProducts.map((item) => {
      if (item.Product)
        item.Product.Image =
          fileUrl(item.Product.Image?.File?.name) || showNoImage();

      item.id = encodeInt(item.id);
      //item.marketID = encodeInt(market.);
    });

    res.send({
      status: true,
      products: marketProducts,
      hasMore: marketProducts.length == itemCount ? true : false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
