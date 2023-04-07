import {
  handlePagination,
  LimitHttpMethode,
} from "../../../../../server/common/requests";
import { fileUrl } from "../../../../../server/common/s3";
import { prisma } from "../../../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");

    const { page, count } = req.query;

    const totalCount = await prisma.product.count();

    const pag = handlePagination(page, totalCount, count);

    let products = await prisma.product.findMany({
      select: {
        id: true,
        dateCreated: true,
        barcode: true,
        isVisible: true,
        ProductInfo: true,
        weight: true,
        Image: { select: { File: { select: { name: true } } } },
        ProductCategory: { select: { id: true } },
        _count: { select: { MarketProducts: true } },
      },
      orderBy: { dateCreated: "desc" },
      skip: pag.skip,
      take: pag.take,
    });

    products.map((product) => {
      if (product.Image) {
        product.Image = fileUrl(product.Image.File.name);
      }
    });

    res.send({ status: true, products, pagination: pag.pagination });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
