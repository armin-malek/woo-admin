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

    const totalCount = await prisma.market.count();

    const pag = handlePagination(page, totalCount, count);

    let markets = await prisma.market.findMany({
      select: {
        id: true,
        User: {
          select: {
            id: true,
            dateRegister: true,
            fullName: true,
            mobile: true,
          },
        },
        name: true,
        Image: { select: { File: { select: { name: true } } } },
        logo: { select: { File: { select: { name: true } } } },

        marketAddress: {
          select: {
            address: true,
            gpsLat: true,
            gpsLong: true,
            Region: true,
            Province: true,
            City: true,
          },
        },
        _count: {
          select: {
            CustomerMarkets: true,
            MarketOrder: true,
            MarketProducts: true,
          },
        },
      },
      orderBy: { User: { dateRegister: "desc" } },
      skip: pag.skip,
      take: pag.take,
    });

    const provinces = await prisma.province.findMany({
      select: {
        id: true,
        name: true,
        Cities: {
          select: {
            id: true,
            name: true,
            Regions: { select: { id: true, name: true } },
          },
        },
      },
    });

    markets.map((item) => {
      item.Image = fileUrl(item.Image?.File?.name, false);
      item.logo = fileUrl(item.logo?.File?.name, false);
    });

    res.send({ status: true, markets, provinces, pagination: pag.pagination });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
