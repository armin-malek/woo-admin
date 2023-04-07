import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const postSchema = z.object({
  orderId: z.number(),
  status: z.enum(["PreparedByMarket", "Canceled"]),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { orderId, status } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    let order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: { Market: { select: { User: { select: { id: true } } } } },
    });

    if (order.Market.User.id != session.user.id) {
      return res.send({
        status: false,
        msg: "این فاکتور متعلق به شما نیست",
      });
    }

    if (order.status != "WaitingMarket") {
      return res.send({
        status: false,
        msg: "فاکتور قابل برگشت نیست.",
      });
    }

    // update order

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: status,
      },
    });

    // notify post man
    // if canceled notify the customer
    res.send({ status: true, msg: "فاکتور با موفقیت نهایی شد" });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
