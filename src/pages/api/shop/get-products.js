import {
  decodeInt,
  encodeInt,
  showNoImage,
} from "../../../server/common/functions";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { LimitHttpMethode } from "../../../server/common/requests";
import { fileUrl } from "../../../server/common/s3";
import { prisma } from "../../../server/db/client";
const itemCount = 12;

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    let { marketID, cat, query, cursor } = req.query;
    if (!marketID) {
      res.send({ status: false, msg: "باید شناسه مارکت ارائه دهید" });
      return;
    }

    // decode marketId
    marketID = decodeInt(marketID);
    cursor = decodeInt(cursor);

    const session = await getServerAuthSession({ req, res });
    const usersMarket = await prisma.customerMarkets.findMany({
      where: {
        Customer: { User: { id: session.user.id } },
        Market: { id: marketID },
      },
    });
    if (usersMarket.length < 1) {
      return res.send({ status: false, msg: "شما مشتری این فروشنده نیستید." });
    }

    let marketProducts = await prisma.marketProducts.findMany({
      where: {
        isVisible: true,
        Product: {
          ProductCategory: {
            slug: cat?.toString() || undefined,
          },
          ProductInfo: { name: { contains: query?.toString() } },
          isVisible: true,
        },
        Market: { id: marketID },
      },
      select: {
        id: true,
        inStock: true,
        Product: {
          select: {
            id: true,
            Image: { select: { File: { select: { name: true } } } },
          },
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
      item.marketID = encodeInt(marketID);
    });

    res.send({
      status: true,
      products: marketProducts,
      hasMore: marketProducts.length == itemCount ? true : false,
    });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
