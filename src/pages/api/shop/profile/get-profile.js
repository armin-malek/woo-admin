import { unstable_getServerSession } from "next-auth";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { authOptions } from "../../auth/[...nextauth]";
import jmoment from "moment-jalaali";
import { prisma } from "../../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    const session = await unstable_getServerSession(req, res, authOptions);

    let data = {
      chart: [],
    };
    jmoment.loadPersian({ dialect: "persian-modern" });

    let totalAmount = 0;
    for (let i = 0; i < 5; i++) {
      let monthStart = jmoment().startOf("jMonth").subtract(i, "jMonth");
      let monthEnd = jmoment().endOf("jMonth").subtract(i, "jMonth");

      let sum = await prisma.marketOrder.aggregate({
        where: {
          Market: { User: { id: session.user.id } },
          date: { gte: monthStart.toISOString(), lte: monthEnd.toISOString() },
        },
        _sum: { amount: true },
        //orderBy: { date: "asc" },
      });

      data.chart.push({
        monthName: monthStart.format("jMMMM"),
        amount: sum._sum.amount > 0 ? sum._sum.amount : 0,
      });
      if (sum?._sum.amount > 0) totalAmount += sum._sum.amount;
    }

    let points = await prisma.marketOrder.aggregate({
      where: {
        Market: { User: { id: session.user.id } },
        status: "Completed",
      },
      _sum: { points: true },
    });

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        fullName: true,
        mobile: true,
        Market: { select: { name: true, marketAddress: true } },
      },
    });

    data.lastAmount = data.chart[0].amount;
    data.totalAmount = totalAmount;
    data.totalPoints = points?._sum.points || 0;
    data.user = user;

    res.send({ status: true, data });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
