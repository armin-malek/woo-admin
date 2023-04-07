import { z } from "zod";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";

const postSchema = z.object({
  withdrawID: z.number(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { withdrawID } = req.body;

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    const withdraw = await prisma.marketWithdraw.findUnique({
      where: { id: withdrawID },
      select: {
        status: true,
        Market: { select: { id: true } },
      },
    });

    if (!withdraw) {
      res.send({
        status: false,
        msg: "درخواست توسیه موردنظر در سیستم وجود ندارد!",
      });
      return;
    }

    if (withdraw.status != "Requested") {
      res.send({
        status: false,
        msg: "به درخواست توسیه مورد نظر قبلا رسیدگی شده!",
      });
      return;
    }

    await prisma.marketWithdraw.update({
      where: { id: withdrawID },
      data: {
        dateCompleted: currentIranTimeDB(),
        status: "Rejected",
        Market: { update: { frozenBalance: { decrement: withdraw.amount } } },
      },
    });

    // notify user with sms

    res.send({ status: true, msg: "توسیه حساب رد شد" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
