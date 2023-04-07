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

    const totalCount = await prisma.user.count({ where: { role: "Customer" } });

    const pag = handlePagination(page, totalCount, count);

    let users = await prisma.user.findMany({
      where: { role: "Customer" },
      select: {
        id: true,
        dateRegister: true,
        fullName: true,
        mobile: true,
        lastLogin: true,
        Customer: {
          select: {
            _count: { select: { CustomerMarkets: true, Orders: true } },
          },
        },
      },
      orderBy: { dateRegister: "desc" },
      skip: pag.skip,
      take: pag.take,
    });

    users.map((user) => {
      user.dateRegister = parseDateFull(user.dateRegister);
      user.lastLogin = parseDateFull(user.lastLogin);
    });

    res.send({ status: true, users, pagination: pag.pagination });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
