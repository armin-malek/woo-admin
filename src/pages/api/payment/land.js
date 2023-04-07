import { verifyPayment } from "../../../server/common/payment";
import { LimitHttpMethode } from "../../../server/common/requests";
import { currentIranTimeDB } from "../../../server/common/time";
import { prisma } from "../../../server/db/client";

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "GET");
    const { trackId, status, success } = req.query;

    console.log("trackId", trackId);
    let payment = await prisma.payment.findUnique({
      where: {
        transActionCode: trackId.toString(),
      },
      select: { status: true, id: true },
    });

    if (!payment) {
      return res.redirect(
        `/shop/orders?pok=false&pmsg=${encodeURI(
          "سفارش مورد نظر در سیستم وجود ندارد."
        )}`
      );
    }

    if (payment.status !== "INPROGRESS") {
      return res.redirect(
        `/shop/orders?pok=false&pmsg=${encodeURI(
          "این سفارش قبلا پرداخت شده ویا لفو شده است."
        )}`
      );
    }

    if (success != 1) {
      return res.redirect(
        `/shop/orders?pok=false&pmsg=${encodeURI("پرداخت ناموفق!")}`
      );
    }
    if (status != 1 && status != 2) {
      return res.redirect(
        `/shop/orders?pok=false&pmsg=${encodeURI("پرداخت ناموفق!")}`
      );
    }
    let verfiedPayment = await verifyPayment(trackId);
    if (!verfiedPayment) throw new Error("payment veification faild");
    if (verfiedPayment.error === true) {
      return res.redirect(
        `/shop/orders?pok=false&pmsg=${encodeURI(verfiedPayment.message)}`
      );
    }

    await prisma.order.update({
      where: { paymentId: payment.id },
      data: {
        status: "WaitingMarket",
        Payment: {
          update: {
            status: "PAYED",
            dateFinalized: currentIranTimeDB(),
            gateWayCardNumber: verfiedPayment.cardNumber,
            gateWayRefNumber: verfiedPayment.refNumber,
          },
        },
      },
    });
    return res.redirect(
      `/shop/orders?pok=true&pmsg=${encodeURI("سفارش شما با موفقیت ثبت شد.")}`
    );
  } catch (err) {
    console.log(err);
    return res.redirect(
      `/shop/orders?pok=false&pmsg=${encodeURI(
        "خطایی در پردازش سفارش رخ داد!"
      )}`
    );
  }
};

export default handler;
