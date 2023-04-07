import { unstable_getServerSession } from "next-auth";
import { decodeInt } from "../../../../server/common/functions";
import { startPayment } from "../../../../server/common/payment";
import { LimitHttpMethode } from "../../../../server/common/requests";
import { fileUrl } from "../../../../server/common/s3";
import { prisma } from "../../../../server/db/client";
import { authOptions } from "../../auth/[...nextauth]";
import requestIp from "request-ip";
import { currentIranTimeDB } from "../../../../server/common/time";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");
    const { orderID } = req.body;
    const session = await unstable_getServerSession(req, res, authOptions);

    let order = await prisma.order.findUnique({
      where: {
        id: orderID,
      },
      select: {
        id: true,
        amount: true,
        status: true,
        Customer: { select: { User: { select: { id: true, mobile: true } } } },
      },
    });

    if (!order) {
      return res.send({
        status: false,
        msg: "سفارش مورد نظر در سیستم وجود ندارد",
      });
    }
    if (order.Customer.User.id != session.user.id) {
      return res.send({
        status: false,
        msg: "این سفارش مطعلق به شما نیست!",
      });
    }
    if (order.status != "Unpaid") {
      return res.send({
        status: false,
        msg: "این سفارش قابل پرداخت نیست!",
      });
    }
    const startedPayment = await startPayment(
      order.amount * 10,
      order.Customer.User.mobile
    );
    await prisma.order.update({
      where: { id: orderID },
      data: {
        Payment: {
          delete: true,
          create: {
            PaymentMethode: "Online",
            status: "INPROGRESS",
            userIP: requestIp.getClientIp(req),
            dateCreated: currentIranTimeDB(),
            gateWay: startedPayment.gateWay,
            transActionCode: startedPayment.trackId.toString(),
          },
        },
      },
    });

    return res.send({
      status: true,
      redirect: startedPayment.paymentUrl,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: "خطایی رخ داد" });
  }
};

export default handler;
