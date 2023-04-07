import { unstable_getServerSession } from "next-auth";
import {
  LimitHttpMethode,
  handlePagination,
} from "../../../../../server/common/requests";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    const session = await unstable_getServerSession(req, res, authOptions);

    const { page, count } = req.query;

    const totalCount = await prisma.order.count({
      where: {
        Market: { User: { id: session.user.id } },
        NOT: { status: "Unpaid" },
      },
    });

    const pag = handlePagination(page, totalCount, count);

    let orders = await prisma.order.findMany({
      where: {
        Market: { User: { id: session.user.id } },
        NOT: { status: "Unpaid" },
      },
      select: {
        id: true,
        amount: true,
        date: true,
        deliveredDate: true,
        sendedDate: true,
        items: true,
        status: true,
        Customer: {
          select: { User: { select: { fullName: true, mobile: true } } },
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
