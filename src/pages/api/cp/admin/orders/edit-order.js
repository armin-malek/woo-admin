import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import {
  CalcOrderPoints,
  percentageOff,
} from "../../../../../server/common/functions";
import { LimitHttpMethode } from "../../../../../server/common/requests";
import { fileUrl } from "../../../../../server/common/s3";
import { currentIranTimeDB } from "../../../../../server/common/time";
import { prisma } from "../../../../../server/db/client";
import { authOptions } from "../../../auth/[...nextauth]";

const postSchema = z.object({
  items: z.array(z.object({ id: z.number(), quantity: z.number().min(1) })), // array of Items
  orderId: z.number(),
  status: z.enum([
    "Unpaid",
    "WaitingMarket",
    "PreparedByMarket",
    "OnDelivery",
    "Completed",
    "Canceled",
    "Returned",
  ]),
});

const handler = async (req, res) => {
  try {
    LimitHttpMethode(req, res, "POST");

    const { orderId, items } = req.body;
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
      select: {
        id: true,
        balanceEffected: true,
        Market: { select: { id: true, orderFeePercent: true } },
      },
    });

    let products = await prisma.marketProducts.findMany({
      where: { id: { in: items.map((x) => parseInt(x.id)) } },
      include: {
        ProductInfo: true,
        Product: {
          include: {
            Image: { select: { File: { select: { name: true } } } },
          },
        },
      },
    });
    //let availableItems = [];
    let newItems = [];
    let newTotalPrice = 0;
    items.forEach((item) => {
      let product = products.find((product) => product.id == item.id);
      if (product) {
        let price = product.ProductInfo.specialPrice
          ? product.ProductInfo.specialPrice
          : product.ProductInfo.basePrice;

        newItems.push({
          id: product.id,
          name: product.ProductInfo.name,
          price: price,
          quantity: item.quantity,
          Image: fileUrl(product.Image?.File?.name),
        });

        newTotalPrice += price * item.quantity;
      }
      //availableItems.push(item);
    });
    if (newItems.length < 1) {
      return res.send({
        status: false,
        msg: "هیچکدام از محصولات سفارش دیگر در دسترس نیستند",
      });
    }

    newTotalPrice = Math.round(newTotalPrice);

    if (order.balanceEffected == false && req.body.status == "Completed") {
      let orderUpdate = prisma.order.update({
        where: { id: order.id },
        data: {
          items: newItems,
          amount: newTotalPrice,
          status: req.body.status,
          balanceEffected: true,
        },
        select: { Market: { select: { id: true } } },
      });
      let balaceUpdate = prisma.market.update({
        where: { id: order.Market.id },
        data: {
          balance: {
            increment:
              order.balanceEffected == false
                ? Math.round(
                    percentageOff(newTotalPrice, order.Market.orderFeePercent)
                  )
                : undefined,
          },
        },
      });

      await prisma.$transaction([orderUpdate, balaceUpdate]);
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          items: newItems,
          amount: newTotalPrice,
          status: req.body.status,
        },
        select: { Market: { select: { id: true } } },
      });
    }

    res.send({ status: true, msg: "فاکتور با موفقیت ویرایش داده شد" });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

export default handler;
