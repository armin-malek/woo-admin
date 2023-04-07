import { z } from "zod";
import { getServerAuthSession } from "../../../../../server/common/get-server-auth-session";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";

const postSchema = z.object({
  amount: z.number(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { amount } = req.body;

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const session = await getServerAuthSession({ req, res });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        MarketOwned: {
          select: { id: true, balance: true },
        },
      },
    });

    if (amount > user.MarketOwned.balance) {
      res.send({ status: false, msg: "مبلغ درخواستی بیشتر از موجودی شماست!" });
      return;
    }
    const createWithdraw = prisma.marketWithdraw.create({
      data: {
        amount: amount,
        dateCreated: currentIranTimeDB(),
        status: "Requested",
        Market: { connect: { id: user.MarketOwned.id } },
      },
    });

    const updateBalance = prisma.market.update({
      where: { id: user.MarketOwned.id },
      data: {
        balance: { decrement: amount },
        frozenBalance: { increment: amount },
      },
    });

    await prisma.$transaction([createWithdraw, updateBalance]);

    res.send({
      status: true,
      msg: "درخواست تسویه حساب شما در صف بررسی قرار گرفت.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
