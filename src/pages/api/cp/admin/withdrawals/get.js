import {
  handlePagination,
  LimitHttpMethode,
} from "../../../../../server/common/requests";
import { parseDateFull } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");

    const { page, count } = req.query;

    const totalCount = await prisma.marketWithdraw.count();

    const pag = handlePagination(page, totalCount, count);

    let withdraws = await prisma.marketWithdraw.findMany({
      select: {
        id: true,
        amount: true,
        dateCreated: true,
        dateCompleted: true,
        status: true,
        bankTransactionCode: true,
        Market: {
          select: {
            name: true,
            User: { select: { fullName: true, mobile: true } },
          },
        },
      },
      orderBy: { dateCreated: "desc" },
      skip: pag.skip,
      take: pag.take,
    });

    withdraws.map((item) => {
      item.amount = item.amount.toString();
      item.dateCreated = parseDateFull(item.dateCreated);
      item.dateCompleted = parseDateFull(item.dateCompleted);
    });

    res.send({ status: true, withdraws, pagination: pag.pagination });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
