import {
  handlePagination,
  LimitHttpMethode,
} from "../../../../../server/common/requests";
import { prisma } from "../../../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");

    const { page, count } = req.query;

    const totalCount = await prisma.order.count();

    const pag = handlePagination(page, totalCount, count);

    let orders = await prisma.order.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        deliveredDate: true,
        sendedDate: true,
        items: true,
        status: true,
        Payment: {
          select: {
            id: true,
            dateCreated: true,
            dateFinalized: true,
            gateWay: true,
            OfflineBillingType: true,
            PaymentMethode: true,
            status: true,
            transActionCode: true,
            userIP: true,
          },
        },
        CustomerAddress: { select: { gpsLat: true, gpsLong: true } },
        Customer: {
          select: {
            User: { select: { id: true, fullName: true, mobile: true } },
          },
        },
        Market: {
          select: {
            marketAddress: { select: { address: true } },
            name: true,
            User: { select: { fullName: true, mobile: true } },
          },
        },
      },
      orderBy: { date: "desc" },
      skip: pag.skip,
      take: pag.take,
    });

    res.send({ status: true, orders, pagination: pag.pagination });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
