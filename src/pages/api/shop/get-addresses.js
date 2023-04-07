import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import { LimitHttpMethode } from "../../../server/common/requests";
import { decodeInt } from "../../../server/common/functions";
import haversine from "haversine-distance";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");

    let { marketID } = req.query;
    marketID = decodeInt(marketID);
    if (!marketID) {
      return res.send({ status: false, msg: "شناسه فروشنده نا مشخص" });
    }

    const market = await prisma.market.findUnique({
      where: { id: marketID },
      select: { marketAddress: { select: { gpsLat: true, gpsLong: true } } },
    });
    if (!market) {
      return res.send({ status: false, msg: "فروشنده در سیستم وجود ندارد." });
    }

    const session = await unstable_getServerSession(req, res, authOptions);
    const Addresses = await prisma.customerAddress.findMany({
      where: { Customer: { User: { id: session.user.id } }, isRemoved: false },
      orderBy: { DateCreated: "asc" },
      select: {
        id: true,
        address: true,
        DateCreated: true,
        gpsLat: true,
        gpsLong: true,
      },
    });

    Addresses.map((item) => {
      item.DateCreated = `${item.DateCreated}`;
      const distance = haversine(
        {
          lat: market.marketAddress.gpsLat,
          lng: market.marketAddress.gpsLong,
        },
        { lat: item.gpsLat, lng: item.gpsLong }
      );
      item.distance = distance;
      if (distance > parseInt(process.env.NEXT_PUBLIC_MAX_AIR_DISTANCE))
        item.inRange = false;
      else item.inRange = true;
    });

    res.send({ status: true, data: Addresses });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
