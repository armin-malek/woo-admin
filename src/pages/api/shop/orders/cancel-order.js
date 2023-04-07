import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { prisma } from "../../../../server/db/client";
import { authOptions } from "../../auth/[...nextauth]";

const postSchema = z.object({
  orderId: z.string(),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { orderId } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.send({
        status: false,
        msg: "برای این کار باید ورود کرده باشید",
      });
      return;
    }

    if (!postSchema.safeParse(req.body).success) {
      return res.send({
        status: false,
        msg: "اطلاعات ارسالی صحیح نمی باشند.",
      });
    }

    let order = await prisma.marketOrder.findUnique({
      where: {
        id: orderId,
      },
      include: { Market: { include: { User: true } } },
    });
    if (order.Market.User.id != session.user.id) {
      return res.send({
        status: false,
        msg: "این فاکتور متعلق به شما نیست",
      });
    }

    if (order.status != "Submitted") {
      return res.send({
        status: false,
        msg: "فاکتور موردنظر در حال پردازش یا تکمیل شده است و نمی توان آن را لفو کرد.",
      });
    }

    /*
    await prisma.marketOrder.update({
      where: { id: order.id },
      data: { status: "Canceled" },
    });
*/
    await prisma.marketOrder.delete({ where: { id: order.id } });
    res.send({ status: true, msg: "فاکتور با موفقیت حذف شد" });

    //res.send({ meta: { status: true }, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
