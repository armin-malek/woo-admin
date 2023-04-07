import { unstable_getServerSession } from "next-auth";
import {
  LimitHttpMethode,
  handlePagination,
} from "../../../../../server/common/requests";
import { parseDateFull } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    const session = await unstable_getServerSession(req, res, authOptions);

    const { page, count } = req.query;

    const totalCount = await prisma.customer.count({
      where: {
        CustomerMarkets: {
          some: { Market: { User: { id: session.user.id } } },
        },
      },
    });

    const pag = handlePagination(page, totalCount, count);

    let customers = await prisma.customer.findMany({
      where: {
        CustomerMarkets: {
          some: { Market: { User: { id: session.user.id } } },
        },
      },
      select: {
        id: true,
        User: {
          select: {
            fullName: true,
            mobile: true,
            dateRegister: true,
            lastLogin: true,
          },
        },
      },
      orderBy: { User: { dateRegister: "desc" } },
      skip: pag.skip,
      take: pag.take,
    });

    let customerIds = customers.map((customer) => customer.id);
    let customersOrders = await prisma.order.groupBy({
      where: {
        Customer: { id: { in: customerIds } },
        //, status: "Completed"
      },
      by: ["customerId"],
      _count: { customerId: true },
    });

    // insert orderCount
    customersOrders.map((cOrder) => {
      let idx = customers.findIndex((x) => x.id == cOrder.customerId);
      customers[idx].orderCount = cOrder._count.customerId;
    });

    // converstion
    customers.map((customer) => {
      customer.User.dateRegister = parseDateFull(customer.User.dateRegister);
    });
    res.send({ status: true, customers, pagination: pag.pagination });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
