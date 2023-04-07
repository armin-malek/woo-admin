import { decodeInt, showNoImage } from "../../../server/common/functions";
import { LimitHttpMethode } from "../../../server/common/requests";
import { fileUrl } from "../../../server/common/s3";
import { prisma } from "../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    /*
    let { marketID } = req.query;
    marketID = decodeInt(marketID);
    */
    let categories = await prisma.productCategories.findMany({
      where: { isActive: true },
      select: {
        Image: { select: { File: { select: { name: true } } } },
        name: true,
        id: true,
      },
      orderBy: { viewOrder: "asc" },
    });

    categories.map((item) => {
      if (item.Image)
        item.Image = fileUrl(item.Image.File.name) || showNoImage();
    });

    res.send({ status: true, data: categories });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
