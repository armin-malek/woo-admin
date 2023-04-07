import { showNoImage } from "../../../../../server/common/functions";
import { getServerAuthSession } from "../../../../../server/common/get-server-auth-session";
import {
  LimitHttpMethode,
  handlePagination,
} from "../../../../../server/common/requests";
import { fileUrl } from "../../../../../server/common/s3";
import { prisma } from "../../../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    let { cat, s, page, count } = req.query;

    const session = await getServerAuthSession({ req, res });

    const totalCount = await prisma.product.count({
      where: {
        ProductCategory: {
          slug: cat?.toString() || undefined,
        },
        OR: [
          { ProductInfo: { name: { contains: s?.toString() } } },
          { barcode: { startsWith: s?.toString() } },
        ],
        isVisible: true,
      },
    });

    const pag = handlePagination(page, totalCount, count);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { MarketOwned: { select: { id: true } } },
    });

    let products = await prisma.product.findMany({
      where: {
        ProductCategory: {
          slug: cat?.toString() || undefined,
        },
        OR: [
          { ProductInfo: { name: { contains: s?.toString() } } },
          { barcode: { startsWith: s?.toString() } },
        ],
        isVisible: true,
      },
      select: {
        id: true,
        barcode: true,
        Image: { select: { File: { select: { name: true } } } },
        ProductInfo: {
          select: {
            basePrice: true,
            name: true,
            shortDesc: true,
            specialPrice: true,
          },
        },
        MarketProducts: {
          where: { Market: { id: user.MarketOwned.id } },
          select: { id: true },
        },
      },
      skip: pag.skip,
      take: pag.take,
    });

    products.map((item) => {
      item.Image = fileUrl(item.Image?.File?.name) || showNoImage();
      item.hasProduct = item.MarketProducts.length > 0 ? true : false;
      delete item.MarketProducts;
    });

    res.send({ status: true, products, pagination: pag.pagination });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
