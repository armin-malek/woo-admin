import { unstable_getServerSession } from "next-auth";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { prisma } from "../../../../server/db/client";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    const session = await unstable_getServerSession(req, res, authOptions);

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        Market: {
          select: {
            marketAddress: { select: { Region: { select: { id: true } } } },
          },
        },
        role: true,
      },
    });

    let markets = await prisma.market.findMany({
      where: {
        marketAddress: { Region: { id: user.Market.marketAddress.Region.id } },
      },
      select: {
        id: true,
        name: true,
        totalPoints: true,
        User: { select: { id: true } },
      },
      orderBy: { totalPoints: "desc" },
    });

    for (let i = 0; i < markets.length; i++) {
      markets[i].position = i + 1;
      markets[i].isYou = markets[i].User.id == session.user.id ? true : false;
      delete markets[i].id;
    }

    res.send({ status: true, data: markets });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
