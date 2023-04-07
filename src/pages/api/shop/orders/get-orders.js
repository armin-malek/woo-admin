import { unstable_getServerSession } from "next-auth";
import { decodeInt } from "../../../../server/common/functions";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { fileUrl } from "../../../../server/common/s3";
import { prisma } from "../../../../server/db/client";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");

    const session = await unstable_getServerSession(req, res, authOptions);

    let orders = await prisma.order.findMany({
      where: {
        Customer: { User: { id: session.user.id } },
      },
      orderBy: {
        Payment: { dateCreated: "desc" },
      },
      select: {
        id: true,
        amount: true,
        date: true,
        deliveredDate: true,
        sendedDate: true,
        items: true,
        Market: {
          select: {
            name: true,
            logo: { select: { File: { select: { name: true } } } },
            marketAddress: { select: { gpsLat: true, gpsLong: true } },
          },
        },
        status: true,
        Payment: {
          select: {
            PaymentMethode: true,
            status: true,
            transActionCode: true,
            dateFinalized: true,
          },
        },
        CustomerAddress: {
          select: { address: true, gpsLat: true, gpsLong: true },
        },
      },
    });

    orders.map((order) => {
      order.Market.logo = fileUrl(
        order.Market?.logo?.File?.name,
        "/img/logo.png"
      );

      //order.Market.marketAddress.gpsLat
    });

    res.send({ status: true, data: orders });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: "خطایی رخ داد" });
  }
};

export default handler;
