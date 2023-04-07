import { getServerAuthSession } from "../../../../../server/common/get-server-auth-session";
import {
  LimitHttpMethode,
  handlePagination,
} from "../../../../../server/common/requests";
import { parseDateFull } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");

    const session = await getServerAuthSession({ req, res });
    const { page, count } = req.query;

    const totalCount = await prisma.marketWithdraw.count({
      where: { Market: { User: { id: session.user.id } } },
    });

    const pag = handlePagination(page, totalCount, count);

    let marketWithdraws = await prisma.marketWithdraw.findMany({
      where: { Market: { User: { id: session.user.id } } },
      orderBy: { dateCreated: "desc" },
      select: {
        id: true,
        amount: true,
        dateCreated: true,
        dateCompleted: true,
        status: true,
        bankTransactionCode: true,
      },
      skip: pag.skip,
      take: pag.take,
    });

    const market = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        MarketOwned: { select: { balance: true, frozenBalance: true } },
      },
    });

    marketWithdraws.map((item) => {
      item.dateCreated = parseDateFull(item.dateCreated);
      item.dateCompleted = parseDateFull(item.dateCompleted);
      item.amount = item.amount.toString();
    });

    res.send({
      status: true,
      marketWithdraws,
      balance: market.MarketOwned.balance.toString(),
      frozenBalance: market.MarketOwned.frozenBalance.toString(),
      pagination: pag.pagination,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
